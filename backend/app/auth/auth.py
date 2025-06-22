from datetime import datetime, timedelta
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.auth.jwt import decode_access_token
from app.crud.user import get_user, get_user_by_email
from app.models.otp import OTP
from app.schemas.otp import OTPVerify

oauth2_schema = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    token: str = Depends(oauth2_schema), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Erreur lors de la validation des informations",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception

    user = get_user(db, user_id)
    if user is None:
        raise credentials_exception

    return user


def create_otp(db: Session, user_id: str):
    code = str(uuid4().int)[-6:]

    expires = datetime.now() + timedelta(minutes=10)
    otp = OTP(code=code, expires_at=expires, user_id=user_id)
    db.add(otp)
    db.commit()
    return code


def verify_otp(db: Session, otp: OTPVerify):
    user = get_user_by_email(db, otp.email)
    if not user:
        return None

    latest = (
        db.query(OTP)
        .where(OTP.user_id == user.id)
        .order_by(OTP.expires_at.desc())
        .first()
    )
    if latest and latest.code == otp.code and latest.expires_at > datetime.now():
        user.is_verified = True
        db.commit()
        db.refresh(user)
        return user
    return None
