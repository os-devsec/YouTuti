from urllib.parse import urlparse

from fastapi import HTTPException


def validate_public_url(value: str, field_name: str) -> str:
    clean_value = value.strip()
    parsed = urlparse(clean_value)

    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise HTTPException(
            status_code=422,
            detail=f"{field_name} debe ser una URL valida http o https"
        )

    return clean_value
