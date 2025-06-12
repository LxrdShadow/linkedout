from datetime import datetime
from uuid import uuid4

from sqlalchemy import UUID, Column, DateTime, String

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=uuid4)
    username = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.now)
