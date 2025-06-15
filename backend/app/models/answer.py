from uuid import uuid4

from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Answer(Base):
    __tablename__ = "answers"

    id = Column(String, primary_key=True, default=uuid4)
    question_id = Column(String, ForeignKey("questions.id"))
    text_response = Column(Text)
    # audio_path = Column(String)

    question = relationship("Question", back_populates="answer")
    feedbacks = relationship("Feedback", back_populates="answer")
