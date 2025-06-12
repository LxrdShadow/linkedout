from uuid import UUID

from pydantic import BaseModel


class AnswerBase(BaseModel):
    text_response: str
    # audio_path: str


class AnswerCreate(AnswerBase):
    pass


class AnswerOut(AnswerBase):
    id: UUID
    question_id: UUID

    class Config:
        orm_mode = True
