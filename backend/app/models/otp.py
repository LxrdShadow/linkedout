from datetime import datetime
from uuid import uuid4

from sqlalchemy import UUID, Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class OTP(Base):
    __tablename__ = "otps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    code = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", backref="otps")
