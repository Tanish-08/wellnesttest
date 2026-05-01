from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class AssessmentCreate(BaseModel):
    total_score: int
    risk_factors_score: int
    symptoms_score: int
    answers: Dict[str, Any]

class AssessmentResponse(BaseModel):
    id: str
    user_id: str
    total_score: int
    risk_factors_score: int
    symptoms_score: int
    answers: Dict[str, Any]
    created_at: datetime
