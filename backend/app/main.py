from fastapi import FastAPI

from app.api.routes.user import router as user_router
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router)


@app.get("/")
async def hello():
    return "Hello world"
