from uuid import uuid4

from sqlalchemy import UUID, Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    interview_id = Column(
        UUID(as_uuid=True), ForeignKey("interviews.id", ondelete="CASCADE")
    )
    index = Column(Integer)
    text = Column(Text)

    interview = relationship("Interview", back_populates="questions")
