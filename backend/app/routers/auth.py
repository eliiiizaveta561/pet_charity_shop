from typing import Optional

from fastapi import APIRouter, Cookie, Depends, Response, status
from sqlalchemy.orm import Session

from .. import auth, models, schemas
from ..config import settings
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["Авторизация"])

REFRESH_COOKIE = "refresh_token"
# Браузер отправляет cookie только на адреса /api/auth/*, остальным запросам она не нужна
COOKIE_PATH = "/api/auth"


def set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        REFRESH_COOKIE,
        token,
        max_age=settings.refresh_token_days * 24 * 60 * 60,
        httponly=True,  # JavaScript на странице не может прочитать токен
        secure=settings.cookie_secure,
        samesite="lax",  # чужой сайт не сможет отправить POST с этой cookie
        path=COOKIE_PATH,
    )


@router.post("/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: schemas.RegisterRequest, response: Response, db: Session = Depends(get_db)):
    user = auth.register_user(db, data)
    tokens, refresh_token = auth.start_session(db, user)
    set_refresh_cookie(response, refresh_token)
    return tokens


@router.post("/login", response_model=schemas.TokenResponse)
def login(data: schemas.LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = auth.authenticate(db, data)
    tokens, refresh_token = auth.start_session(db, user)
    set_refresh_cookie(response, refresh_token)
    return tokens


@router.post("/refresh", response_model=schemas.TokenResponse)
def refresh(
    response: Response,
    refresh_token: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db),
):
    tokens, new_refresh_token = auth.refresh_session(db, refresh_token)
    set_refresh_cookie(response, new_refresh_token)
    return tokens


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    refresh_token: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db),
):
    auth.end_session(db, refresh_token)
    response.delete_cookie(REFRESH_COOKIE, path=COOKIE_PATH)


@router.get("/me", response_model=schemas.UserRead)
def me(user: models.User = Depends(auth.get_current_user)):
    return user
