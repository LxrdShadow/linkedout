from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.question import Question
from app.schemas.question import QuestionCreate


def create_question(db: Session, question_in: QuestionCreate, interview: Interview):
    question = Question(
        id=str(uuid4()),
        text=question_in.text,
        interview_id=interview.id,
        index=question_in.index,
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


def get_question(db: Session, question_id: str):
    return db.query(Question).where(Question.id == question_id).first()


def get_interview_questions(db: Session, interview: Interview):
    return (
        db.query(Question)
        .where(Question.interview_id == interview.id)
        .order_by(Question.index.asc())
        .all()
    )
