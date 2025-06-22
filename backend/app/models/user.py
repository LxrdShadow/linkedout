from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, String

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=uuid4)
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
