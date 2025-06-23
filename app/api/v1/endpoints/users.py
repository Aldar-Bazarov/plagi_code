import logging
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserInDB, UserUpdatePassword
from app.core.database import get_db

router = APIRouter(prefix="/users", tags=["users"])
logger = logging.getLogger(__name__)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db=Depends(get_db)
):
    auth_service = AuthService(UserRepository(db))
    return auth_service.get_current_user(token)

def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db=Depends(get_db)
):
    auth_service = AuthService(UserRepository(db))
    return auth_service.get_current_admin(auth_service.get_current_user(token))

@router.post("/register", response_model=UserInDB)
def register_user(
    user_data: UserCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_admin)
):
    logger.info(f"Регистрация пользователя: {user_data.email}")
    user_service = UserService(UserRepository(db))
    return user_service.register_user(user_data)

@router.get("/me", response_model=UserInDB)
def read_current_user(current_user=Depends(get_current_user)):
    logger.info(f"Просмотр профиля пользователя: {current_user.username}")
    return current_user

@router.post("/reset")
def reset_password(
    user_data: UserUpdatePassword,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    logger.info(f"Сброс пароля для пользователя: {current_user.username}")
    user_service = UserService(UserRepository(db))
    return user_service.reset_password(user_data, current_user.username)