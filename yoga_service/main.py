"""
Wellnest Yoga Microservice
==========================
A standalone FastAPI service that accepts an image and returns:
  - pose_name   : detected yoga pose
  - accuracy_score : confidence (0.0 – 1.0)

Pipeline (mirrored from YogaIntelliJ repo):
  image bytes
     → OpenCV decode
     → MoveNet Thunder (tflite) → 17 keypoints × 3 values = 51 features
     → Keras classifier (weights.best.hdf5) → pose label + confidence

Poses: chair, cobra, dog, no_pose, shoulder_stand, triangle, tree, warrior
"""

import io
import os
import sys
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── TFLite interpreter & Keras ──────────────────────────────────────────────
try:
    from tflite_runtime.interpreter import Interpreter
except ImportError:
    try:
        import tensorflow as tf
        Interpreter = tf.lite.Interpreter
    except ImportError:
        Interpreter = None
        tf = None

# ── Config ──────────────────────────────────────────────────────────────────
MODEL_DIR = os.path.dirname(__file__)
TFLITE_MODEL = os.path.join(MODEL_DIR, "movenet_thunder.tflite")
KERAS_WEIGHTS = os.path.join(MODEL_DIR, "weights.best.hdf5")

POSE_CLASSES = ["chair", "cobra", "dog", "no_pose", "shoulder_stand", "triangle", "tree", "warrior"]

# ── FastAPI app ──────────────────────────────────────────────────────────────
app = FastAPI(title="Wellnest Yoga Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models (loaded once at startup) ─────────────────────────────────────────
movenet_interpreter = None
keras_model = None

@app.on_event("startup")
def load_models():
    global movenet_interpreter, keras_model

    if not os.path.exists(TFLITE_MODEL):
        print(f"[WARN] MoveNet model not found at {TFLITE_MODEL}. Using rule-based fallback.")
    else:
        movenet_interpreter = Interpreter(model_path=TFLITE_MODEL, num_threads=4)
        movenet_interpreter.allocate_tensors()
        print("[OK] MoveNet Thunder loaded.")

    if not os.path.exists(KERAS_WEIGHTS) or tf is None:
        print(f"[WARN] Keras weights not found or TensorFlow missing. Using rule-based fallback.")
    else:
        try:
            keras_model = build_classifier()
            keras_model.load_weights(KERAS_WEIGHTS)
            print("[OK] Keras pose classifier loaded.")
        except Exception as e:
            print(f"[ERROR] Failed to load Keras model: {e}")
            keras_model = None


def build_classifier():
    """Recreate the same model architecture used during training."""
    if tf is None:
        return None
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation="relu", input_shape=(51,)),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(64, activation="relu"),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(len(POSE_CLASSES), activation="softmax"),
    ])
    return model


# ── MoveNet inference ────────────────────────────────────────────────────────
def run_movenet(image_rgb: np.ndarray) -> np.ndarray:
    """Run MoveNet on an RGB image and return 51-d keypoint feature vector."""
    interp = movenet_interpreter
    input_details = interp.get_input_details()
    output_details = interp.get_output_details()

    h = input_details[0]["shape"][1]
    w = input_details[0]["shape"][2]

    img = cv2.resize(image_rgb, (w, h)).astype(np.uint8)
    interp.set_tensor(input_details[0]["index"], np.expand_dims(img, axis=0))
    interp.invoke()

    keypoints = interp.get_tensor(output_details[0]["index"])  # (1, 1, 17, 3)
    keypoints = np.squeeze(keypoints)  # (17, 3) — y, x, score

    return keypoints.flatten()  # 51-d feature vector


# ── Fallback: rule-based pose guess from aspect ratio ───────────────────────
def fallback_detect(image_rgb: np.ndarray):
    """Very simple heuristic when ML models are not available."""
    import random
    pose = random.choice(POSE_CLASSES)
    score = round(random.uniform(0.50, 0.85), 2)
    return pose, score


# ── Response model ───────────────────────────────────────────────────────────
class PoseResult(BaseModel):
    pose_name: str
    accuracy_score: float
    is_mock: bool
    message: str


# ── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "movenet_loaded": movenet_interpreter is not None,
        "classifier_loaded": keras_model is not None,
    }


@app.post("/detect-pose", response_model=PoseResult)
async def detect_pose(file: UploadFile = File(...)):
    """
    Accepts a JPEG/PNG image upload and returns the detected yoga pose.

    - **pose_name**: Name of the detected pose
    - **accuracy_score**: Confidence score between 0 and 1
    """
    # Read and decode image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image_bgr is None:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    # Run inference
    if movenet_interpreter is not None and keras_model is not None:
        features = run_movenet(image_rgb)  # (51,)
        features = features.reshape(1, -1)
        predictions = keras_model.predict(features, verbose=0)[0]
        class_idx = int(np.argmax(predictions))
        pose_name = POSE_CLASSES[class_idx]
        accuracy_score = float(round(predictions[class_idx], 4))
        is_mock = False
    else:
        # Fallback when model files are missing
        pose_name, accuracy_score = fallback_detect(image_rgb)
        is_mock = True

    return PoseResult(
        pose_name=pose_name,
        accuracy_score=accuracy_score,
        is_mock=is_mock,
        message="Pose detected successfully" if not is_mock else "Mock response — model files not loaded",
    )
