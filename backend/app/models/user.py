from datetime import datetime
from uuid import uuid4

from sqlalchemy import UUID, Column, DateTime, String, Text

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=uuid4)
    username = Column(String)
    hashed_password = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now())
