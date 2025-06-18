from uuid import UUID

from pydantic import BaseModel


class QuestionBase(BaseModel):
    text: str


class QuestionCreate(QuestionBase):
    pass


class QuestionOut(QuestionBase):
    id: UUID
    interview_id: UUID

    class Config:
        from_attributes = True
