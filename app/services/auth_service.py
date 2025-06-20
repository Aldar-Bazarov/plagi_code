from datetime import timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings
from app.core.security import create_access_token, decode_token, get_password_hash, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.token import TokenData
from app.schemas.user import UserLogin

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def authenticate_user(self, user_data: UserLogin) -> dict | None:
        user = self.user_repository.get_user_by_email(user_data.email)
        if not user:
            return None
        if not verify_password(user_data.password, user.hashed_password):
            return None
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        token_data = decode_token(token)
        if token_data is None:
            raise credentials_exception
        
        email = token_data.get("sub")
        if email is None:
            raise credentials_exception
        
        user = self.user_repository.get_user_by_email(email)
        if user is None:
            raise credentials_exception
        
        return user

    def get_current_admin(self, current_user: dict = Depends(get_current_user)):
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin users can perform this action",
            )
        return current_user