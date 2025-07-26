from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import app.crud.answer as answer_crud
import app.crud.feedback as feedback_crud
import app.crud.question as question_crud
from app.api.deps import get_db
from app.schemas.answer import AnswerCreate
from app.schemas.feedback import FeedbackCreate, FeedbackOut
from app.services.question import get_feedback

router = APIRouter(prefix="/questions", tags=["questions"])


@router.post(
    "/{question_id}/answer",
    response_model=FeedbackOut,
    status_code=status.HTTP_201_CREATED,
)
async def answer_question(
    question_id: UUID, answer: AnswerCreate, db: Session = Depends(get_db)
):
    question = question_crud.get_question(db, question_id)
    if not question:
        raise HTTPException(404, "Question not found.")

    new_answer = answer_crud.create_answer(db, answer, question)
    feedback = get_feedback(
        question.interview.role, question.text, new_answer.text_response
    )

    feedback_in = FeedbackCreate(
        score=float(feedback["score"]),
        feedback=feedback["feedback"],
        advice=feedback["advice"],
        level=feedback["level"],
    )

    return feedback_crud.create_feedback(db, feedback_in, new_answer)
