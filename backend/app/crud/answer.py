from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.answer import Answer
from app.models.question import Question
from app.schemas.answer import AnswerCreate


def create_answer(db: Session, answer: AnswerCreate, question: Question):
    answer = Answer(
        id=str(uuid4), question_id=question.id, text_answer=answer.text_response
    )
    db.save(answer)
    db.commit()
    db.refresh()
    return answer
