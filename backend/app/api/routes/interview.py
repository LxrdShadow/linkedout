from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import app.crud.interview as interview_crud
import app.crud.question as question_crud
from app.api.deps import get_db
from app.auth.auth import get_current_user
from app.models.user import User
from app.schemas.interview import Difficulty, InterviewCreate, InterviewOut
from app.schemas.question import QuestionCreate, QuestionOut
from app.services.question import get_questions_from_json

router = APIRouter(prefix="/interviews", tags=["interviews"])


@router.get("/", response_model=list[InterviewOut], status_code=status.HTTP_200_OK)
async def read_interviews(
    skip: int = 0,
    limit: int = 10,
    auth_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return interview_crud.get_user_interviews(db, auth_user.id, skip=skip, limit=limit)


@router.post("/", response_model=list[QuestionOut], status_code=status.HTTP_201_CREATED)
async def create_interview(
    interview: InterviewCreate,
    auth_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if interview.difficulty not in Difficulty:
        raise HTTPException(400, "Niveau de difficulté invalide.")

    interview = interview_crud.create_interview(db, interview, auth_user.id)
    questions: list[QuestionOut] = []

    # TODO: Get the questions from AI based on the interview role and the difficulty
    question_list = get_questions_from_json()

    for question in question_list:
        question_out = question_crud.create_question(
            db, QuestionCreate(text=question["text"]), interview
        )
        questions.append(question_out)

    return questions
