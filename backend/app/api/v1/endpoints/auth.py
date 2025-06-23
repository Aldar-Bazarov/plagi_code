import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.schemas.token import Token
from app.schemas.user import UserLogin
from app.core.database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db)
):
    logger.info(f"Попытка входа: {form_data.username}")
    auth_service = AuthService(UserRepository(db))
    user_data = UserLogin(username=form_data.username, password=form_data.password)
    token = auth_service.authenticate_user(user_data)
    if not token:
        logger.warning(f"Неудачная попытка входа: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    logger.info(f"Успешный вход: {form_data.username}")
    return token