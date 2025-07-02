from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.question import QuestionOut


class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


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
    questions: list[QuestionOut]

    class Config:
        from_attribute = True
