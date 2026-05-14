from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    content: str
    created_at: datetime = datetime.utcnow()

    user_id: int = Field(foreign_key="user.id")
    video_id: int = Field(foreign_key="video.id")