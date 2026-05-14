from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Video(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    title: str
    description: str
    thumbnail_url: str
    video_url: str

    views: int = 0
    created_at: datetime = datetime.utcnow()

    user_id: int = Field(foreign_key="user.id")
    category_id: int = Field(foreign_key="category.id")