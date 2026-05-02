from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List
import httpx
import os
from db.supabase import supabase
from dependencies import get_current_user
from models.yoga import YogaSessionCreate, YogaSessionResponse, YogaAnalyzeResponse

router = APIRouter(prefix="/yoga", tags=["Yoga"])

YOGA_SERVICE_URL = os.getenv("YOGA_SERVICE_URL", "http://localhost:8001")


# ── POST /yoga/analyze ────────────────────────────────────────────────────────
@router.post("/analyze", response_model=YogaAnalyzeResponse)
async def analyze_yoga_pose(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    """
    Frontend → Main Backend → Yoga Microservice → DB
    Accepts an image, detects the pose via the yoga service, and saves the result.
    """
    image_bytes = await file.read()

    # Forward to yoga microservice
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{YOGA_SERVICE_URL}/detect-pose",
                files={"file": (file.filename, image_bytes, file.content_type)},
            )
            response.raise_for_status()
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Yoga service is unavailable. Please ensure it is running on port 8001."
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Yoga service error: {e.response.text}")

    result = response.json()
    pose_name = result["pose_name"]
    accuracy_score = result["accuracy_score"]
    is_mock = result.get("is_mock", False)

    # Save to yoga_sessions table (notes records is_mock flag for auditability)
    db = supabase()
    db_result = db.table("yoga_sessions").insert({
        "user_id": user_id,
        "session_type": pose_name,
        "duration_minutes": 0,
        "notes": f"Auto-detected via image. Confidence: {accuracy_score:.0%}. is_mock={is_mock}"
    }).execute()

    return YogaAnalyzeResponse(
        pose_name=pose_name,
        accuracy_score=accuracy_score,
        is_mock=is_mock,
        saved=bool(db_result.data),
        message=f"Detected '{pose_name}' with {accuracy_score:.0%} confidence"
    )


# ── POST /yoga/save-session ───────────────────────────────────────────────────
@router.post("/save-session", response_model=YogaSessionResponse)
def save_yoga_session(
    session: YogaSessionCreate,
    user_id: str = Depends(get_current_user)
):
    db = supabase()
    result = db.table("yoga_sessions").insert({
        "user_id": user_id,
        "session_type": session.session_type,
        "duration_minutes": session.duration_minutes,
        "notes": session.notes
    }).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save yoga session"
        )
    return result.data[0]


# ── GET /yoga/yoga-history ────────────────────────────────────────────────────
@router.get("/yoga-history", response_model=List[YogaSessionResponse])
def get_yoga_history(
    user_id: str = Depends(get_current_user)
):
    db = supabase()
    result = db.table("yoga_sessions").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data

