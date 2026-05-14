from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str
    video_id: int


class CommentUpdate(BaseModel):
    content: str
