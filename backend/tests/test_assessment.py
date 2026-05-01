import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from jose import jwt
import sys
import os
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Mock Supabase
mock_db = MagicMock()

with patch.dict(os.environ, {
    "SUPABASE_URL": "https://fake.supabase.co",
    "SUPABASE_SERVICE_KEY": "fake-key",
    "SECRET_KEY": "test-secret",
}):
    from main import app
    import routers.assessment
    routers.assessment.supabase = lambda: mock_db

client = TestClient(app)

# Helper to generate test token
def create_test_token(user_id: str):
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode = {"sub": user_id, "exp": expire}
    return jwt.encode(to_encode, "test-secret", algorithm="HS256")

MOCK_ASSESSMENT = {
    "id": "assess-uuid-123",
    "user_id": "user-uuid-123",
    "total_score": 85,
    "risk_factors_score": 40,
    "symptoms_score": 45,
    "answers": {"1": 5, "2": 0},
    "created_at": "2026-05-01T12:00:00Z"
}

def test_create_assessment():
    mock_db.table.return_value.insert.return_value.execute.return_value.data = [MOCK_ASSESSMENT]
    token = create_test_token("user-uuid-123")
    
    resp = client.post(
        "/assessments/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "total_score": 85,
            "risk_factors_score": 40,
            "symptoms_score": 45,
            "answers": {"1": 5, "2": 0}
        }
    )
    
    assert resp.status_code == 201
    data = resp.json()
    assert data["id"] == "assess-uuid-123"
    assert data["total_score"] == 85

def test_create_assessment_unauthorized():
    resp = client.post(
        "/assessments/",
        json={
            "total_score": 85,
            "risk_factors_score": 40,
            "symptoms_score": 45,
            "answers": {"1": 5, "2": 0}
        }
    )
    assert resp.status_code == 401

def test_get_assessments():
    mock_db.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [MOCK_ASSESSMENT]
    token = create_test_token("user-uuid-123")
    
    resp = client.get(
        "/assessments/",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["id"] == "assess-uuid-123"

def test_get_assessments_unauthorized():
    resp = client.get("/assessments/")
    assert resp.status_code == 401
