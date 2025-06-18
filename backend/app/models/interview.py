from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, String, Text

from app.db.base import Base
from app.schemas.interview import Difficulty


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True, default=str(uuid4))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String)
    role = Column(String)
    difficulty = Column(Enum(Difficulty), default=Difficulty.EASY)
    started_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime, nullable=True)
    total_score = Column(Float, nullable=True)
    feedback_summary = Column(Text, nullable=True)
