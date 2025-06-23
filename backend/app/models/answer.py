from uuid import uuid4

from sqlalchemy import UUID, Column, ForeignKey, Text

from app.db.base import Base


class Answer(Base):
    __tablename__ = "answers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    question_id = Column(
        UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE")
    )
    text_response = Column(Text)
    # audio_path = Column(String)
