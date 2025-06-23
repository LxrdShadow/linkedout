from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str
    confirmPassword: str


class UserOut(UserBase):
    id: UUID
    username: str | None = None
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes: True


class UsernameSet(BaseModel):
    username: str
