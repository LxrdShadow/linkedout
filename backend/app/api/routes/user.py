from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

import app.crud.user as crud
from app.api.deps import get_db
from app.auth.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserOut], status_code=status.HTTP_200_OK)
async def read_users(
    skip: int = 0,
    limit: int = 10,
    auth_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.get_users(db, skip=skip, limit=limit)


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing = crud.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    return crud.create_user(db, user)


@router.get("/{user_id}", response_model=UserOut, status_code=status.HTTP_200_OK)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    if user_id is None:
        raise HTTPException(
            status_code=401, detail="Authentication Failed: You are not authorized"
        )

    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
