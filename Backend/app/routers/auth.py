from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import LoginSchema
from app.schemas.user import UserCreate

router = APIRouter()


@router.post("/register")
def register(user: UserCreate, session: Session = Depends(get_session)):
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.post("/login")
def login(data: LoginSchema, session: Session = Depends(get_session)):
    user = session.exec(
        select(User).where(User.email == data.email)
    ).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }