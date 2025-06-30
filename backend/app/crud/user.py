from uuid import uuid4

from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_user(db: Session, user_in: UserCreate):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(400, "Email already in use.")

    user = User(
        id=str(uuid4()),
        email=user_in.email,
        hashed_password=_hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str):
    return db.query(User).where(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).where(User.username == username).first()


def get_user(db: Session, user_id: str):
    user = db.query(User).where(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found.")

    return user


def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(User).offset(skip).limit(limit).all()


def set_username(db: Session, user_id: str, username: str):
    user = get_user(db, user_id)

    user.username = username
    db.commit()
    return user
