import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# ------------------------------------------------------------------
# Build a reusable mock Supabase client
# ------------------------------------------------------------------
mock_db = MagicMock()

from jose import jwt
from datetime import datetime, timedelta

def create_test_token(user_id: str):
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode = {"sub": user_id, "exp": expire}
    return jwt.encode(to_encode, "test-secret", algorithm="HS256")

MOCK_USER = {
    "id": "user-uuid-123",
    "full_name": "John Doe",
    "email": "john@example.com",
    "password_hash": "hashed_password123",   # fake hash, we mock verify_password
    "date_of_birth": "1990-01-01",
    "gender": "male",
}

with patch.dict(os.environ, {
    "SUPABASE_URL": "https://fake.supabase.co",
    "SUPABASE_SERVICE_KEY": "fake-key",
    "SECRET_KEY": "test-secret",
}):
    from main import app
    import routers.auth
    routers.auth.supabase = lambda: mock_db

client = TestClient(app)


def _set_select_response(data):
    """Configure the SELECT mock chain."""
    mock_db.table.return_value \
        .select.return_value \
        .eq.return_value \
        .execute.return_value.data = data


def _set_insert_response(data):
    """Configure the INSERT mock chain."""
    mock_db.table.return_value \
        .insert.return_value \
        .execute.return_value.data = data


# ── Register ────────────────────────────────────────────────────────────────

def test_register_success():
    _set_select_response([])          # no existing user
    _set_insert_response([MOCK_USER]) # insert succeeds

    with patch("routers.auth.hash_password", return_value="hashed_password123"):
        resp = client.post("/auth/register", json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "password": "password123",
            "date_of_birth": "1990-01-01",
            "gender": "male",
        })

    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert data["email"] == "john@example.com"
    assert data["token_type"] == "bearer"


def test_register_duplicate_email():
    _set_select_response([MOCK_USER])  # email already exists

    resp = client.post("/auth/register", json={
        "full_name": "John Doe",
        "email": "john@example.com",
        "password": "password123",
        "date_of_birth": "1990-01-01",
        "gender": "male",
    })
    assert resp.status_code == 409
    assert "already registered" in resp.json()["detail"]


def test_register_short_password():
    _set_select_response([])

    resp = client.post("/auth/register", json={
        "full_name": "John Doe",
        "email": "john@example.com",
        "password": "short",
        "date_of_birth": "1990-01-01",
        "gender": "male",
    })
    assert resp.status_code == 422


# ── Login ───────────────────────────────────────────────────────────────────

def test_login_success():
    _set_select_response([MOCK_USER])

    with patch("routers.auth.verify_password", return_value=True):
        resp = client.post("/auth/login", json={
            "email": "john@example.com",
            "password": "password123",
        })

    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user_id"] == "user-uuid-123"


def test_login_wrong_password():
    _set_select_response([MOCK_USER])

    with patch("routers.auth.verify_password", return_value=False):
        resp = client.post("/auth/login", json={
            "email": "john@example.com",
            "password": "wrongpassword",
        })

    assert resp.status_code == 401


def test_login_unknown_email():
    _set_select_response([])

    resp = client.post("/auth/login", json={
        "email": "nobody@example.com",
        "password": "password123",
    })
    assert resp.status_code == 401


# ── Get Profile ─────────────────────────────────────────────────────────────

def test_get_profile_success():
    _set_select_response([MOCK_USER])
    token = create_test_token("user-uuid-123")

    resp = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "john@example.com"
    assert data["full_name"] == "John Doe"


def test_get_profile_not_found():
    _set_select_response([])
    token = create_test_token("nonexistent-id")

    resp = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 404
