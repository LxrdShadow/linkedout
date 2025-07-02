from fastapi import FastAPI

from app.api.routes import audio, auth, interview, question, user
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()


# @app.middleware("http")
# async def log_request_body(request: Request, call_next):
#     body = await request.body()
#     print(f"Incoming body: {body.decode()}")
#     response = await call_next(request)
#     return response


app.include_router(auth.router)
app.include_router(user.router)
app.include_router(interview.router)
app.include_router(question.router)
app.include_router(audio.router)


@app.get("/")
async def hello():
    return "Hello world"
