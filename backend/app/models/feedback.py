from datetime import datetime
from uuid import uuid4

from sqlalchemy import UUID, Column, DateTime, Float, ForeignKey, String, Text

from app.db.base import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    answer_id = Column(UUID(as_uuid=True), ForeignKey("answers.id", ondelete="CASCADE"))
    score = Column(Float)
    feedback = Column(Text)
    advice = Column(Text)
    level = Column(String)
    # source = Column(String, default="AI")
    created_at = Column(DateTime, default=datetime.now)
