from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi import FastAPI
from fastapi import Request
from sqlmodel import Field, Session, SQLModel, create_engine
from database import engine, Base
from routers import user, quiz, question, quiz_submission

from models import User, Quiz, Question, QuizSession, Answer

Base.metadata.create_all(engine)


app = FastAPI()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user.router)
app.include_router(quiz.router)
app.include_router(question.router)
app.include_router(quiz_submission.router)

@app.get("/")
def read_root():
    return {"Hello": "Welcome to Task"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)