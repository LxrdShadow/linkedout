from fastapi_mail import ConnectionConfig, FastMail, MessageSchema

from app.core.config import (
    MAIL_FROM,
    MAIL_FROM_NAME,
    MAIL_PASSWORD,
    MAIL_PORT,
    MAIL_SERVER,
    MAIL_SSL_TLS,
    MAIL_STARTTLS,
    MAIL_USERNAME,
)

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_FROM_NAME=MAIL_FROM_NAME,
    MAIL_STARTTLS=MAIL_STARTTLS,
    MAIL_SSL_TLS=MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER="app/templates",
)


async def send_otp_email(email_to: str, otp_code: str):
    message = MessageSchema(
        subject="🔐 Votre code de vérification",
        recipients=[email_to],
        template_body={"code": otp_code},
        subtype="html",
    )

    fm = FastMail(conf)
    await fm.send_message(message, template_name="otp.html")
