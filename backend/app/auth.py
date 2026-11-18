"""Регистрация, вход, выдача и обновление токенов, проверка текущего пользователя."""
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas
from .config import settings
from .database import get_db
from .errors import AppError
from .security import (
    create_access_token,
    decode_access_token,
    hash_password,
    hash_refresh_token,
    new_refresh_token,
    verify_password,
)

# auto_error=False: без заголовка Authorization вернём свою понятную ошибку 401
bearer = HTTPBearer(auto_error=False)


def unauthorized(message: str) -> AppError:
    return AppError(401, message, headers={"WWW-Authenticate": "Bearer"})


def register_user(db: Session, data: schemas.RegisterRequest) -> models.User:
    if db.scalar(select(models.User.id).where(models.User.email == data.email)) is not None:
        raise AppError(409, "Пользователь с такой почтой уже зарегистрирован")
    user = models.User(
        email=data.email,
        name=data.name.strip(),
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate(db: Session, data: schemas.LoginRequest) -> models.User:
    user = db.scalar(select(models.User).where(models.User.email == data.email))
    # Одно сообщение на оба случая, чтобы по ответу нельзя было узнать, есть ли такая почта
    if user is None or not verify_password(data.password, user.password_hash):
        raise unauthorized("Неверная почта или пароль")
    return user


def token_response(user: models.User) -> schemas.TokenResponse:
    return schemas.TokenResponse(
        access_token=create_access_token(user.id, user.role),
        expires_in=settings.access_token_minutes * 60,
        user=schemas.UserRead.model_validate(user),
    )


def start_session(db: Session, user: models.User) -> tuple[schemas.TokenResponse, str]:
    """Новая сессия: запись refresh token в БД и пара токенов для клиента."""
    refresh_token = new_refresh_token()
    db.add(
        models.RefreshToken(
            user_id=user.id,
            token_hash=hash_refresh_token(refresh_token),
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_days),
        )
    )
    db.commit()
    return token_response(user), refresh_token


def find_token_record(db: Session, refresh_token: str) -> Optional[models.RefreshToken]:
    return db.scalar(
        select(models.RefreshToken).where(
            models.RefreshToken.token_hash == hash_refresh_token(refresh_token)
        )
    )


def refresh_session(db: Session, refresh_token: Optional[str]) -> tuple[schemas.TokenResponse, str]:
    if not refresh_token:
        raise unauthorized("Refresh token не передан, войдите заново")
    record = find_token_record(db, refresh_token)
    if record is None:
        raise unauthorized("Некорректный refresh token")
    if record.revoked_at is not None:
        raise unauthorized("Refresh token отозван, войдите заново")
    if record.expires_at <= datetime.now(timezone.utc):
        raise unauthorized("Срок действия refresh token истёк, войдите заново")

    # Ротация: старый refresh token отзываем и выдаём новый.
    # Если токен украдут, им получится воспользоваться не больше одного раза.
    record.revoked_at = datetime.now(timezone.utc)
    return start_session(db, record.user)


def end_session(db: Session, refresh_token: Optional[str]) -> None:
    if not refresh_token:
        return
    record = find_token_record(db, refresh_token)
    if record is not None and record.revoked_at is None:
        record.revoked_at = datetime.now(timezone.utc)
        db.commit()


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer),
    db: Session = Depends(get_db),
) -> models.User:
    if credentials is None:
        raise unauthorized("Требуется вход в систему")
    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.ExpiredSignatureError:
        raise unauthorized("Срок действия access token истёк")
    except jwt.InvalidTokenError:
        raise unauthorized("Некорректный access token")

    user = db.get(models.User, int(payload["sub"]))
    if user is None:
        raise unauthorized("Пользователь не найден")
    return user


def is_admin(user: models.User) -> bool:
    return user.role == "admin"


def require_admin(user: models.User = Depends(get_current_user)) -> models.User:
    if not is_admin(user):
        raise AppError(403, "Недостаточно прав: действие доступно только администратору")
    return user
