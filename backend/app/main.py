from fastapi import FastAPI

from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
async def hello():
    return "Hello world"
