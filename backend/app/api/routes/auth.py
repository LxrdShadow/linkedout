from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import app.crud.user as crud_user
from app.api.deps import get_db
from app.auth.auth import create_otp
from app.auth.jwt import create_access_token
from app.schemas.token import Token
from app.schemas.user import UserCreate
from app.services.email import send_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if len(user_in.password) < 4:
        raise HTTPException(400, "Le mot de passe doit avoir au moins 4 caractères.")

    if user_in.password != user_in.confirmPassword:
        raise HTTPException(400, "Les mots de passes ne correspondent pas.")

    existing = crud_user.get_user_by_email(db, user_in.email)
    if existing:
        if existing.is_verified:
            raise HTTPException(400, "Email déja vérifié.")
        else:
            # TODO: HTTPException: Should resend verification code with /resend-otp
            # and check if the cooldown is complete
            user = existing
    else:
        user = crud_user.create_user(db, user_in)

    try:
        otp = create_otp(db, user.id)
        await send_otp_email(user.email, otp)
    except Exception:
        raise HTTPException(
            status_code=500, detail="Erreur lors de l'envoi de l'email."
        )
    return user


@router.post("/verify", status_code=status.HTTP_200_OK)
async def verify_OTP(otp: str, db: Session = Depends(get_db)):
    # TODO: Verify the OTP sent to the user by email
    ...


@router.post("/set-username/{user_id}", status_code=status.HTTP_200_OK)
async def set_username(user_id: str, username: str, db: Session = Depends(get_db)):
    user = crud_user.set_username(db, user_id, username)
    access_token = create_access_token(data={"sub": user.id})

    return Token(access_token=access_token, token_type="bearer")


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
