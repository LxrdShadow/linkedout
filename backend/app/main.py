from fastapi import FastAPI

from app.api.routes import auth, interview, question, user
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(interview.router)
app.include_router(question.router)


@app.get("/")
async def hello():
    return "Hello world"
