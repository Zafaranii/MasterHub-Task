from pydantic import BaseModel, EmailStr
from typing import Optional
from models.Question import QuestionType

class QuestionCreate(BaseModel):
    question: str
    type: QuestionType
    options: Optional[list[str]] = None
    true_false_answer: Optional[bool] = None
    short_answer: Optional[str] = None
    correct_answer: str
    points: int = 1
    quiz_id: int

class QuestionResponse(BaseModel):
    id: int
    quiz_id: int
    question: str
    type: QuestionType
    options: Optional[list[str]] = None
    true_false_answer: Optional[bool] = None
    correct_answer: str
    points: int

    class Config:
        from_attributes = True

class QuestionView(BaseModel):
    id: int
    question: str
    type: QuestionType
    options: Optional[list[str]] = None

    class Config:
        from_attributes = True