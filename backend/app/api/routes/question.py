from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import app.crud.answer as answer_crud
import app.crud.question as question_crud
from app.api.deps import get_db
from app.schemas.answer import AnswerCreate, AnswerOut

router = APIRouter(prefix="/questions", tags=["questions"])


@router.post(
    "/{question_id}/answer",
    response_model=AnswerOut,
    status_code=status.HTTP_201_CREATED,
)
async def answer_question(
    question_id: UUID, answer: AnswerCreate, db: Session = Depends(get_db)
):
    question = question_crud.get_question(db, question_id)
    if not question:
        raise HTTPException(404, "La question n'a pas été trouvé.")

    return answer_crud.create_answer(db, answer, question)
