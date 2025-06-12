from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.sqlite import BLOB as UUID

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=uuid4)
    username = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.now)
