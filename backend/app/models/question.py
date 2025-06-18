from uuid import uuid4

from sqlalchemy import Column, ForeignKey, String, Text

from app.db.base import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=uuid4)
    interview_id = Column(String, ForeignKey("interviews.id", ondelete="CASCADE"))
    text = Column(Text)
