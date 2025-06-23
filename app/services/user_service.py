import logging
from fastapi import HTTPException, status

from app.core.security import get_password_hash, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdatePassword

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def register_user(self, user_data: UserCreate) -> dict:
        logger.info(f"Регистрация пользователя: {user_data.email}")
        if self.user_repository.get_user_by_email(user_data.email):
            logger.warning(f"Email уже зарегистрирован: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        
        if self.user_repository.get_user_by_username(user_data.username):
            logger.warning(f"Username уже занят: {user_data.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken",
            )
        
        hashed_password = get_password_hash(user_data.password)
        db_user = self.user_repository.create_user({
            "email": user_data.email,
            "username": user_data.username,
            "hashed_password": hashed_password,
            "role": "user"
        })
        
        logger.info(f"Пользователь успешно зарегистрирован: {user_data.email}")
        return db_user

    def reset_password(self, user_data: UserUpdatePassword, user_username: str) -> dict:
        logger.info(f"Сброс пароля для пользователя: {user_username}")
        user = self.user_repository.get_user_by_username(user_username)
        if not user:
            logger.warning(f"Пользователь не найден: {user_username}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        if not verify_password(user_data.old_password, user.hashed_password):
            logger.warning(f"Неверный старый пароль для пользователя: {user_username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect old password",
            )
        
        if user_data.new_password != user_data.confirm_new_password:
            logger.warning(f"Несовпадение новых паролей для пользователя: {user_username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New passwords don't match",
            )
        
        hashed_password = get_password_hash(user_data.new_password)
        updated_user = self.user_repository.update_user_password(user, hashed_password)
        logger.info(f"Пароль успешно сброшен для пользователя: {user_username}")
        return updated_user