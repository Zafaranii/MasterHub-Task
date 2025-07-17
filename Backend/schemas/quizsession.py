from pydantic import BaseModel
from typing import Optional, List
from schemas.answer import AnswerCreate 
from datetime import datetime

class QuizSessionCreate(BaseModel):
    quiz_id: int
    answers: List[AnswerCreate] = []

class QuizSessionResponse(BaseModel):
    id: int
    quiz_id: int
    student_id: int
    start_time: datetime
    score: Optional[int] = None

    class Config:
        from_attributes = True

class QuizSessionScore(BaseModel):
    id: int
    score: int

    class Config:
        from_attributes = True 
