from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import DATABASE_URL

engine: Engine = create_engine(DATABASE_URL)
SessionLocal: Session = sessionmaker(autoflush=False, bind=engine)
