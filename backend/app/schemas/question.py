from uuid import UUID

from pydantic import BaseModel


class QuestionBase(BaseModel):
    question_text: str
    question_index: int


class QuestionCreate(QuestionBase):
    pass


class QuestionOut(QuestionBase):
    id: UUID
    interview_id: UUID

    class Config:
        orm_mode = True
