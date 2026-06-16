from fastapi import APIRouter
from app.schemas.auth import RegisterRequest, LoginRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(user: RegisterRequest):
    return {
        "message": "Register endpoint skeleton"
    }

@router.post("/login")
def login(user: LoginRequest):
    return {
        "message": "Login endpoint skeleton"
    }