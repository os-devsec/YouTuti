from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_token

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2)):
    try:
        payload = decode_token(token)
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")