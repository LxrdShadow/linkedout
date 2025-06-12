from uuid import uuid4

from sqlalchemy import Column, ForeignKey, Text
from sqlalchemy.dialects.sqlite import BLOB as UUID

from app.db.base import Base


class Answer(Base):
    __tablename__ = "answers"

    id = Column(UUID, primary_key=True, default=uuid4)
    question_id = Column(UUID, ForeignKey("questions.id"))
    text_response = Column(Text)
    # audio_path = Column(String)
