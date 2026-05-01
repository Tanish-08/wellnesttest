from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    date_of_birth: str   # format: YYYY-MM-DD
    gender: str          # "male" | "female" | "other"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    full_name: str
    email: str


class UserProfile(BaseModel):
    id: str
    full_name: str
    email: str
    date_of_birth: Optional[str]
    gender: Optional[str]
