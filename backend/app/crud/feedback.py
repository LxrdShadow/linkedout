from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.answer import Answer
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate


def create_feedback(db: Session, feedback_in: FeedbackCreate, answer: Answer):
    feedback = Feedback(
        id=str(uuid4()),
        answer_id=answer.id,
        score=feedback_in.score,
        feedback=feedback_in.feedback,
        advice=feedback_in.advice,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback
