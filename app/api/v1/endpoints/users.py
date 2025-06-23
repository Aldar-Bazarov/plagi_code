from fastapi import APIRouter, Depends, HTTPException, status

from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserInDB, UserUpdatePassword
from app.core.database import get_db

router = APIRouter(prefix="/users", tags=["users"])

auth_service = AuthService(UserRepository(get_db))

@router.post("/register", response_model=UserInDB)
def register_user(
    user_data: UserCreate,
    db=Depends(get_db),
    current_user=Depends(auth_service.get_current_admin)
):
    user_service = UserService(UserRepository(db))
    return user_service.register_user(user_data)

@router.get("/me", response_model=UserInDB)
def read_current_user(current_user=Depends(auth_service.get_current_user)):
    return current_user

@router.post("/reset")
def reset_password(
    user_data: UserUpdatePassword,
    db=Depends(get_db),
    current_user=Depends(auth_service.get_current_user)
):
    user_service = UserService(UserRepository(db))
    return user_service.reset_password(user_data, current_user.email)