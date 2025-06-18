from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

import app.crud.interview as crud
from app.api.deps import get_db
from app.auth.auth import get_current_user
from app.models.user import User
from app.schemas.interview import InterviewCreate, InterviewOut

router = APIRouter(prefix="/interviews", tags=["interviews"])


@router.get("/", response_model=list[InterviewOut], status_code=status.HTTP_200_OK)
async def read_interviews(
    skip: int = 0,
    limit: int = 10,
    auth_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.get_user_interviews(db, auth_user.id, skip=skip, limit=limit)


@router.post("/", response_model=InterviewOut, status_code=status.HTTP_201_CREATED)
async def create_interview(
    interview: InterviewCreate,
    auth_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return crud.create_interview(db, auth_user, interview)
