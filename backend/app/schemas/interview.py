from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class Difficulty(str, Enum):
    EASY = "facile"
    MEDIUM = "intermediaire"
    HARD = "difficile"


class InterviewBase(BaseModel):
    role: str
    difficulty: Difficulty = Difficulty.EASY


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
        from_attribute = True
