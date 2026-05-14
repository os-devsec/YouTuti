from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.category import Category
from app.models.video import Video
from app.core.deps import get_current_user

from app.schemas.category import CategoryCreate

router = APIRouter()


# =========================
# GET categories
# =========================
@router.get("/")
def get_categories(session: Session = Depends(get_session)):
    return session.exec(select(Category)).all()


# =========================
# GET videos by category
# =========================
@router.get("/{category_id}/videos")
def videos_by_category(category_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(Video).where(Video.category_id == category_id)
    ).all()


# =========================
# POST category
# =========================
@router.post("/")
def create_category(
    data: CategoryCreate,
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    category = Category(name=data.name, description=data.description)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category