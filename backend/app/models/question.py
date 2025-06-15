from uuid import uuid4

from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=uuid4)
    interview_id = Column(String, ForeignKey("interviews.id"))
    question_text = Column(Text)
    question_index = Column(Integer)

    interview = relationship("Interview", back_populates="questions")
    answer = relationship("Answer", back_populates="question")
