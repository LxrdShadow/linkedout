from uuid import uuid4

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class OTP(Base):
    __tablename__ = "otps"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="otps")
