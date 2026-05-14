from sqlmodel import Session, select
from fastapi import HTTPException
from typing import Optional
from sqlalchemy import func
import random

from app.models.video import Video


# =========================
# GET ALL (PAGINATED)
# =========================
def get_all_videos(
    session: Session,
    page: int = 1,
    limit: int = 20
):
    offset = (page - 1) * limit

    videos = session.exec(
        select(Video)
        .offset(offset)
        .limit(limit)
    ).all()

    return {
        "page": page,
        "limit": limit,
        "data": videos
    }


# =========================
# GET BY ID
# =========================
def get_video_by_id(
    session: Session,
    video_id: int
):
    video = session.get(Video, video_id)

    if not video:
        raise HTTPException(404, "Video not found")

    return video


# =========================
# SEARCH
# =========================
def search_videos(
    session: Session,
    query: str
):
    return session.exec(
        select(Video)
        .where(func.lower(Video.title).contains(query.lower()))
    ).all()


# =========================
# RECENT
# =========================
def get_recent_videos(session: Session):
    return session.exec(
        select(Video)
        .order_by(Video.created_at.desc())
        .limit(20)
    ).all()


# =========================
# RECOMMENDED
# =========================
def get_recommended_videos(session: Session):
    videos = session.exec(select(Video)).all()

    return random.sample(
        videos,
        min(10, len(videos))
    )


# =========================
# CREATE VIDEO
# =========================
def create_video(
    session: Session,
    video_data: dict
):
    video = Video(**video_data)

    session.add(video)
    session.commit()
    session.refresh(video)

    return video


# =========================
# UPDATE VIDEO
# =========================
def update_video(
    session: Session,
    video: Video,
    title: Optional[str],
    description: Optional[str]
):
    if title:
        video.title = title

    if description:
        video.description = description

    session.add(video)
    session.commit()
    session.refresh(video)

    return video


# =========================
# UPDATE THUMBNAIL
# =========================
def update_thumbnail(
    session: Session,
    video: Video,
    thumbnail_url: str
):
    video.thumbnail_url = thumbnail_url

    session.add(video)
    session.commit()
    session.refresh(video)

    return video


# =========================
# DELETE VIDEO
# =========================
def delete_video(
    session: Session,
    video: Video
):
    session.delete(video)
    session.commit()
