import bcrypt
import hashlib
import base64
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings


def _prepare_password(password: str) -> bytes:
    password_bytes = password.encode("utf-8")
    digest = hashlib.sha256(password_bytes).digest()
    return base64.b64encode(digest)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_prepare_password(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(_prepare_password(password), hashed.encode("utf-8"))


def create_access_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def decode_token(token: str):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
