from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.dialects.sqlite import BLOB as UUID

from app.db.base import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID, primary_key=True, default=uuid4)
    answer_id = Column(UUID, ForeignKey("answers.id"))
    category = Column(String)
    score = Column(Float)
    comment = Column(Text)
    source = Column(String, default="AI")
    created_at = Column(DateTime, default=datetime.utcnow)
