import logging
from datetime import timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings
from app.core.security import create_access_token, decode_token, get_password_hash, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.token import TokenData
from app.schemas.user import UserLogin

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")
logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def authenticate_user(self, user_data: UserLogin) -> dict | None:
        logger.info(f"Аутентификация пользователя: {user_data.username}")
        user = self.user_repository.get_user_by_username(user_data.username)
        if not user:
            logger.warning(f"Пользователь не найден: {user_data.username}")
            return None
        if not verify_password(user_data.password, user.hashed_password):
            logger.warning(f"Неверный пароль для пользователя: {user_data.username}")
            return None
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        logger.info(f"Пользователь успешно аутентифицирован: {user_data.username}")
        return {"access_token": access_token, "token_type": "bearer"}

    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        token_data = decode_token(token)
        if token_data is None:
            logger.warning("Ошибка декодирования токена")
            raise credentials_exception
        username = token_data.get("sub")
        if username is None:
            logger.warning("Username не найден в токене")
            raise credentials_exception
        user = self.user_repository.get_user_by_username(username)
        if user is None:
            logger.warning(f"Пользователь не найден по username: {username}")
            raise credentials_exception
        logger.info(f"Пользователь получен из токена: {username}")
        return user

    def get_current_admin(self, current_user: dict = Depends(get_current_user)):
        if current_user.role != "admin":
            logger.warning(f"Попытка доступа к админ-функции неадмином: {current_user.email}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin users can perform this action",
            )
        logger.info(f"Доступ к админ-функции: {current_user.email}")
        return current_user