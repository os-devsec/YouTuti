from fastapi import APIRouter, Depends, Form, HTTPException
from sqlmodel import Session
from typing import Optional

from app.db.session import get_session
from app.core.deps import get_current_user
from app.services.url_service import validate_public_url

from app.services.video_service import (
    get_all_videos,
    get_video_by_id,
    search_videos,
    get_recent_videos,
    get_recommended_videos,
    create_video,
    update_video as update_video_service,
    update_thumbnail as update_thumbnail_service,
    delete_video as delete_video_service
)


router = APIRouter()

PLACEHOLDER_THUMBNAIL = "https://partial-practice-video-platform-videos.s3.us-east-1.amazonaws.com/Thumbnails/miniatura_generica.jpg"


# =========================
# GET VIDEOS
# =========================
@router.get("/")
def get_videos(
    page: int = 1,
    limit: int = 20,
    session: Session = Depends(get_session)
):
    return get_all_videos(session, page, limit)


# =========================
# SEARCH
# =========================
@router.get("/search")
def search(
    q: str,
    session: Session = Depends(get_session)
):
    return search_videos(session, q)


# =========================
# RECENT
# =========================
@router.get("/recent")
def recent(session: Session = Depends(get_session)):
    return get_recent_videos(session)

# =========================
# RECOMMENDED
# =========================
@router.get("/recommended")
def recommended(session: Session = Depends(get_session)):
    return get_recommended_videos(session)

# =========================
# GET VIDEO BY ID
# =========================
@router.get("/{video_id}")
def get_video(
    video_id: int,
    session: Session = Depends(get_session)
):
    return get_video_by_id(session, video_id)

# =========================
# CREATE VIDEO
# =========================
@router.post("/")
def upload_video(
    title: str = Form(...),
    description: str = Form(...),
    category_id: int = Form(...),
    video_url: str = Form(...),
    thumbnail_url: Optional[str] = Form(None),
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    video_data = {
        "title": title,
        "description": description,
        "video_url": validate_public_url(video_url, "video_url"),
        "thumbnail_url": validate_public_url(thumbnail_url, "thumbnail_url") if thumbnail_url else PLACEHOLDER_THUMBNAIL,
        "user_id": int(user["sub"]),
        "category_id": category_id
    }
    return create_video(session, video_data)


# =========================
# UPDATE VIDEO
# =========================
@router.put("/{video_id}")
def update_video(
    video_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    video = get_video_by_id(session, video_id)
    if video.user_id != int(user["sub"]):
        raise HTTPException(status_code=403, detail="Not owner")
    return update_video_service(session, video, title, description)


# =========================
# UPDATE THUMBNAIL
# =========================
@router.patch("/{video_id}/thumbnail")
def update_thumbnail(
    video_id: int,
    thumbnail_url: str = Form(...),
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    video = get_video_by_id(session, video_id)
    if video.user_id != int(user["sub"]):
        raise HTTPException(status_code=403, detail="Not owner")
    return update_thumbnail_service(session, video, validate_public_url(thumbnail_url, "thumbnail_url"))


# =========================
# DELETE VIDEO
# =========================
@router.delete("/{video_id}")
def delete_video(
    video_id: int,
    user=Depends(get_current_user),
    session: Session = Depends(get_session)
):
    video = get_video_by_id(session, video_id)

    if video.user_id != int(user["sub"]):
        raise HTTPException(status_code=403, detail="Not owner")

    delete_video_service(session, video)

    return {"message": "deleted"}
