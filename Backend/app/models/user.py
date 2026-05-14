from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password_hash: str
    avatar_url: Optional[str] = None
    created_at: datetime = datetime.utcnow()