@echo off
echo =============================================
echo   Wellnest Yoga Service - Setup and Start
echo =============================================

cd /d "%~dp0"

IF NOT EXIST venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Installing dependencies...
venv\Scripts\pip install -r requirements.txt --quiet

echo.
echo =============================================
echo  IMPORTANT: Model files needed
echo =============================================
echo  Place these in yoga_service\ folder:
echo    1. movenet_thunder.tflite  (12 MB)
echo       Download: https://tfhub.dev/google/lite-model/movenet/singlepose/thunder/tflite/float16/4?lite-format=tflite
echo    2. weights.best.hdf5  (from YogaIntelliJ repo)
echo       https://github.com/harshbhatt7585/YogaIntelliJ/blob/main/classification%%20model/weights.best.hdf5
echo.
echo  If models are missing, the service will use a FALLBACK mode.
echo =============================================
echo.
echo Starting Yoga Service on http://localhost:8001 ...
venv\Scripts\uvicorn main:app --host 0.0.0.0 --port 8001 --reload
