from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AnswerCreate(BaseModel):
    question_id: int
    answer_text: str

class AnswerResponse(BaseModel):
    id: int
    submission_id: int
    question_id: int
    submitted_answer: str
    created_at: datetime

    class Config:
        from_attributes = True

class AnswerUpdate(BaseModel):
    question_id: int
    answer_text: str
    quiz_session_id: int