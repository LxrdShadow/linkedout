from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class FeedbackBase(BaseModel):
    category: str
    score: float
    feedback: str
    advice: str


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackOut(FeedbackBase):
    id: UUID
    answer_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
