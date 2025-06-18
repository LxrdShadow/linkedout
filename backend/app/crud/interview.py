from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.user import User
from app.schemas.interview import InterviewCreate


def get_user_interviews(db: Session, user_id: str, skip: int = 0, limit: int = 10):
    return (
        db.query(Interview)
        .where(Interview.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_interview(db: Session, user: User, interview_in: InterviewCreate):
    interview = Interview(id=str(uuid4()), role=interview_in.role, user_id=user.id)
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview
