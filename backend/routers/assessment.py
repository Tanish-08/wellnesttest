from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.assessment import AssessmentCreate, AssessmentResponse
from dependencies import get_current_user
from db.supabase import supabase

router = APIRouter(prefix="/assessments", tags=["assessments"])

@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    assessment: AssessmentCreate,
    user_id: str = Depends(get_current_user)
):
    db = supabase()
    result = db.table("assessment_results").insert({
        "user_id": user_id,
        "total_score": assessment.total_score,
        "risk_factors_score": assessment.risk_factors_score,
        "symptoms_score": assessment.symptoms_score,
        "answers": assessment.answers
    }).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save assessment result"
        )
    
    return AssessmentResponse(**result.data[0])

@router.get("/", response_model=List[AssessmentResponse])
def get_assessments(user_id: str = Depends(get_current_user)):
    db = supabase()
    result = db.table("assessment_results") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()
    
    return [AssessmentResponse(**row) for row in result.data]
