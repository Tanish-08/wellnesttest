from fastapi import APIRouter, HTTPException, status
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

from models.auth import RegisterRequest, LoginRequest, AuthResponse, UserProfile
from db.supabase import supabase

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    pwd_bytes = plain.encode('utf-8')
    hashed_bytes = hashed.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    db = supabase()
    # Check if email already exists
    existing = db.table("users").select("id").eq("email", body.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Validate password length
    if len(body.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters"
        )

    hashed_pw = hash_password(body.password)

    result = db.table("users").insert({
        "full_name": body.full_name,
        "email": body.email,
        "password_hash": hashed_pw,
        "date_of_birth": body.date_of_birth,
        "gender": body.gender,
    }).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

    user = result.data[0]
    token = create_access_token({"sub": user["id"], "email": user["email"]})

    return AuthResponse(
        access_token=token,
        user_id=user["id"],
        full_name=user["full_name"],
        email=user["email"],
    )


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest):
    db = supabase()
    result = db.table("users").select("*").eq("email", body.email).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user = result.data[0]

    if not verify_password(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({"sub": user["id"], "email": user["email"]})

    return AuthResponse(
        access_token=token,
        user_id=user["id"],
        full_name=user["full_name"],
        email=user["email"],
    )


@router.get("/me/{user_id}", response_model=UserProfile)
def get_profile(user_id: str):
    db = supabase()
    result = db.table("users").select("id, full_name, email, date_of_birth, gender").eq("id", user_id).execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user = result.data[0]
    return UserProfile(**user)
