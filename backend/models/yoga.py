from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class YogaSessionBase(BaseModel):
    session_type: str
    duration_minutes: int
    notes: Optional[str] = None

class YogaSessionCreate(YogaSessionBase):
    pass

class YogaSessionResponse(YogaSessionBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class YogaAnalyzeResponse(BaseModel):
    pose_name: str
    accuracy_score: float
    is_mock: bool
    saved: bool
    message: str

