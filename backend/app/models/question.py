from uuid import uuid4

from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.dialects.sqlite import BLOB as UUID

from app.db.base import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID, primary_key=True, default=uuid4)
    interview_id = Column(UUID, ForeignKey("interviews.id"))
    question_text = Column(Text)
    question_index = Column(Integer)
