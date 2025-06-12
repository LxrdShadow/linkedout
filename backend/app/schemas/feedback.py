from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class FeedbackBase(BaseModel):
    category: str
    score: float
    comment: str
    source: Optional[str] = "AI"


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackOut(FeedbackBase):
    id: UUID
    answer_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
