from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True, default=str(uuid4))
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String)
    role = Column(String)
    started_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime, nullable=True)
    total_score = Column(Float, nullable=True)
    feedback_summary = Column(Text, nullable=True)

    owner = relationship("User", back_populates="interviews")
    questions = relationship("Question", back_populates="interview")
