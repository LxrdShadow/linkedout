from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import app.crud.user as crud_user
from app.api.deps import get_db
from app.auth.jwt import create_access_token
from app.schemas.token import Token
from app.schemas.user import UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    if len(user.password) < 4:
        raise HTTPException(400, "Le mot de passe doit avoir au moins 4 caractères")

    existing = crud_user.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(400, "Email déja utilisé")

    existing = crud_user.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(400, "Nom d'utilisateur déjà utilisé")

    return crud_user.create_user(db, user)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = crud_user.get_user_by_email(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiant ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.id})

    return Token(access_token=access_token, token_type="bearer")
