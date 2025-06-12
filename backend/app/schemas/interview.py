from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class InterviewBase(BaseModel):
    role: str


class InterviewCreate(InterviewBase):
    pass


class InterviewOut(InterviewBase):
    id: UUID
    user_id: UUID
    started_at: datetime
    completed_at: Optional[datetime]
    total_score: Optional[float]
    feedback_summary: Optional[str]

    class Config:
        orm_mode = True
