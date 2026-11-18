"""Хеширование паролей и выпуск токенов. Здесь нет работы с БД, только криптография."""
import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError

from .config import settings

# Argon2id: соль генерируется для каждого пароля и хранится внутри строки хеша
password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return password_hasher.verify(password_hash, password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def create_access_token(user_id: int, role: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "role": role,
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    """Проверяет подпись и срок действия. При ошибке бросает исключение из jwt."""
    payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("not an access token")
    return payload


def new_refresh_token() -> str:
    # Refresh token - просто случайная строка, а не JWT: всё о нём знает база данных
    return secrets.token_urlsafe(48)


def hash_refresh_token(token: str) -> str:
    # В БД лежит только хеш: утечка таблицы не даст готовых токенов
    return hashlib.sha256(token.encode()).hexdigest()
