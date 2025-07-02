import logging
import os

from dotenv import load_dotenv

load_dotenv()
logging.getLogger("passlib").setLevel(logging.ERROR)

DATABASE_URL: str = os.getenv("DATABASE_URL")
SECRET_KEY: str = os.getenv("SECRET_KEY")
ALGORITHM: str = "HS256"

MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_PORT = int(os.getenv("MAIL_PORT"))
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME")
MAIL_STARTTLS = os.getenv("MAIL_STARTTLS") == "True"
MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS") == "True"

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
