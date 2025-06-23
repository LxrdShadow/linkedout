from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY

from app.api.routes import auth, interview, question, user
from app.core.errors import translate_error_message
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    translated_errors = [
        {
            "loc": err["loc"],
            "msg": translate_error_message(err["msg"]),
            "type": err["type"],
        }
        for err in exc.errors()
    ]

    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": translated_errors},
    )


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


@app.get("/")
async def hello():
    return "Hello world"
