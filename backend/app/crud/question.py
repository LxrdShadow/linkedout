from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.question import Question
from app.schemas.question import QuestionCreate


def create_question(db: Session, question_in: QuestionCreate, interview: Interview):
    question = Question(
        id=str(uuid4()), text=question_in.text, interview_id=interview.id
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question
