from fastapi import APIRouter, Depends, Form, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.user import User
from app.models.video import Video
from app.core.deps import get_current_user
from app.services.url_service import validate_public_url

router = APIRouter()


# =========================
# GET user profile
# =========================
@router.get("/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(404)

    return user


# =========================
# GET user videos
# =========================
@router.get("/{user_id}/videos")
def user_videos(user_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(Video).where(Video.user_id == user_id)
    ).all()


# =========================
# PUT /me
# =========================
@router.put("/me")
def update_me(
    username: str | None = None,
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    db_user = session.get(User, int(user["sub"]))

    if username:
        db_user.username = username

    session.add(db_user)
    session.commit()

    return db_user


# =========================
# PATCH avatar
# =========================
@router.patch("/me/avatar")
def change_avatar(
    avatar_url: str = Form(...),
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    db_user = session.get(User, int(user["sub"]))

    db_user.avatar_url = validate_public_url(avatar_url, "avatar_url")

    session.add(db_user)
    session.commit()

    return db_user
