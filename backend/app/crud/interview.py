from uuid import uuid4

from sqlalchemy.orm import Session, joinedload

from app.models.interview import Interview
from app.schemas.interview import InterviewCreate


def get_user_interviews(db: Session, user_id: str, skip: int = 0, limit: int = 10):
    return (
        db.query(Interview)
        .where(Interview.user_id == user_id)
        .options(joinedload(Interview.questions))
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_interview(db: Session, interview_in: InterviewCreate, user_id: str):
    interview = Interview(
        id=str(uuid4()),
        role=interview_in.role,
        difficulty=interview_in.difficulty,
        user_id=user_id,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview
