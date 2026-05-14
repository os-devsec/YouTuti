from pydantic import BaseModel


class VideoCreate(BaseModel):
    title: str
    description: str
    video_url: str
    thumbnail_url: str | None = None
    category_id: int


class VideoRead(BaseModel):
    id: int
    title: str
    description: str
    video_url: str
    thumbnail_url: str
