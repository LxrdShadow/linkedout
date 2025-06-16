from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Float, ForeignKey, String, Text

from app.db.base import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=uuid4)
    answer_id = Column(String, ForeignKey("answers.id", ondelete="CASCADE"))
    category = Column(String)
    score = Column(Float)
    comment = Column(Text)
    source = Column(String, default="AI")
    created_at = Column(DateTime, default=datetime.now)
