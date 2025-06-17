from sqlalchemy.orm import Session

from app.models.interview import Interview


def get_user_interviews(db: Session, user_id: str, skip: int = 0, limit: int = 10):
    return (
        db.query(Interview)
        .where(Interview.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
