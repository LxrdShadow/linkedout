from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jwt import PyJWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import app.crud.user as crud_user
from app.api.deps import get_db
from app.auth.auth import create_otp, get_current_user, verify_otp
from app.auth.jwt import create_tokens, decode_token
from app.models.user import User
from app.schemas.otp import OTPVerify
from app.schemas.token import Token
from app.schemas.user import UserCreate, UsernameSet, UserOut
from app.services.email import send_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if len(user_in.password) < 4:
        raise HTTPException(400, "Password must have at least 4 characters.")

    if user_in.password != user_in.confirmPassword:
        raise HTTPException(400, "Passwords mismatch.")

    existing = crud_user.get_user_by_email(db, user_in.email)
    if existing:
        if existing.is_verified:
            raise HTTPException(400, "Email already verified.")
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
        raise HTTPException(status_code=500, detail="Failed to send the email.")
    return user


@router.post("/verify-otp", response_model=UserOut, status_code=status.HTTP_200_OK)
async def verify_OTP(otp: OTPVerify, db: Session = Depends(get_db)):
    user = verify_otp(db, otp)
    if not user:
        raise HTTPException(400, detail="Invalid or expired OTP.")
    return user


@router.post("/resend-otp", response_model=UserOut, status_code=status.HTTP_200_OK)
async def resend_OTP(email: str, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, email)
    if user:
        if user.is_verified:
            raise HTTPException(400, "Email already verified.")
    else:
        raise HTTPException(404, "Account not found. Check your email or sign up.")

    try:
        otp = create_otp(db, user.id)
        await send_otp_email(user.email, otp)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to send the email")
    return user


@router.post("/set-username/{user_id}", status_code=status.HTTP_200_OK)
async def set_username(
    user_id: str, username_in: UsernameSet, db: Session = Depends(get_db)
):
    user = crud_user.get_user(db, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user = crud_user.set_username(db, user_id, username_in.username)
    tokens = create_tokens(data={"sub": str(user.id)})

    return Token(**tokens)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    if not form_data.username or not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please fill in all fields.",
        )

    user = crud_user.get_user_by_email(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    tokens = create_tokens(data={"sub": str(user.id)})

    return Token(**tokens)


@router.post("/refresh", response_model=Token)
async def refresh_token(body=Body()):
    token = body.get("token")
    if not token:
        raise HTTPException(400, "[hide]Missing refresh token.")

    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
    except PyJWTError as e:
        print(str(e))
        raise HTTPException(401, "[hide]Invalid refresh token")

    tokens = create_tokens(data={"sub": user_id})

    return Token(**tokens)


@router.get("/me", response_model=UserOut, status_code=status.HTTP_200_OK)
async def get_me(auth_user: User = Depends(get_current_user)):
    return auth_user
