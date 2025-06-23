from datetime import datetime
from uuid import uuid4

from sqlalchemy import UUID, Column, DateTime, Enum, Float, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.schemas.interview import Difficulty


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String)
    role = Column(String)
    difficulty = Column(Enum(Difficulty), default=Difficulty.EASY)
    started_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime, nullable=True)
    total_score = Column(Float, nullable=True)
    feedback_summary = Column(Text, nullable=True)

    questions = relationship(
        "Question", back_populates="interview", cascade="all, delete"
    )
