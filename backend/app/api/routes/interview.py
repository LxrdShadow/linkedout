from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import app.crud.interview as interview_crud
import app.crud.question as question_crud
from app.api.deps import get_db
from app.auth.auth import get_current_user
from app.models.user import User
from app.schemas.interview import Difficulty, InterviewCreate, InterviewOut
from app.schemas.question import QuestionCreate, QuestionOut
from app.services.question import get_questions_from_ai

router = APIRouter(prefix="/interviews", tags=["interviews"])


@router.get("/", response_model=list[InterviewOut], status_code=status.HTTP_200_OK)
async def read_interviews(
    skip: int = 0,
    limit: int = 10,
    auth_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return interview_crud.get_user_interviews(db, auth_user, skip=skip, limit=limit)


@router.post("/", response_model=list[QuestionOut], status_code=status.HTTP_201_CREATED)
async def create_interview(
    interview: InterviewCreate,
    auth_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if interview.difficulty not in Difficulty:
        raise HTTPException(400, "Invalid difficulty.")

    interview = interview_crud.create_interview(db, interview, auth_user)
    questions: list[QuestionOut] = []

    try:
        question_list = get_questions_from_ai(interview.role, interview.difficulty)
    except Exception as e:
        raise HTTPException(500, f"Failed to generate the questions: {str(e)}")

    for i, question in enumerate(question_list):
        question_out = question_crud.create_question(
            db, QuestionCreate(text=question["text"], index=i), interview
        )
        questions.append(question_out)

    return questions


@router.get(
    "/{interview_id}/questions",
    response_model=list[QuestionOut],
    status_code=status.HTTP_200_OK,
)
async def read_interview_questions(interview_id: str, db: Session = Depends(get_db)):
    interview = interview_crud.get_interview(db, interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found.")

    return question_crud.get_interview_questions(db, interview)
