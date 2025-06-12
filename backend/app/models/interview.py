from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Float, ForeignKey, String, Text

from app.db.base import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True, default=str(uuid4))
    user_id = Column(String, ForeignKey("users.id"))
    role = Column(String)
    started_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime, nullable=True)
    total_score = Column(Float)
    feedback_summary = Column(Text)
