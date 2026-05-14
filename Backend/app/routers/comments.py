from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.comment import Comment
from app.core.deps import get_current_user
from app.schemas.comment import CommentCreate, CommentUpdate

router = APIRouter()

# =========================
# GET comments by video
# =========================
@router.get("/video/{video_id}")
def get_comments(video_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(Comment)
        .where(Comment.video_id == video_id)
        .order_by(Comment.created_at.desc())
    ).all()


# =========================
# POST comment 
# =========================
@router.post("/")
def create_comment(
    data: CommentCreate,
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    comment = Comment(
        content=data.content,
        video_id=data.video_id,
        user_id=int(user["sub"])
    )

    session.add(comment)
    session.commit()
    session.refresh(comment)

    return comment


# =========================
# PUT comment 
# =========================
@router.put("/{comment_id}")
def update_comment(
    comment_id: int,
    data: CommentUpdate,
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    comment = session.get(Comment, comment_id)

    if not comment:
        raise HTTPException(404, "Comment not found")

    if comment.user_id != int(user["sub"]):
        raise HTTPException(403)

    comment.content = data.content

    session.add(comment)
    session.commit()
    session.refresh(comment)

    return comment


# =========================
# DELETE comment
# =========================
@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    comment = session.get(Comment, comment_id)

    if not comment:
        raise HTTPException(404, "Comment not found")

    if comment.user_id != int(user["sub"]):
        raise HTTPException(403)

    session.delete(comment)
    session.commit()

    return {"message": "deleted"}
