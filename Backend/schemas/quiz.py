from pydantic import BaseModel
from typing import Optional

class QuizCreate(BaseModel):
    title: str
    duration: int
    grade: int

class QuizResponseOfIds(BaseModel):
    id: int
    title: str

class QuizResponse(QuizResponseOfIds):
    title: str
    duration: int
    start_time: Optional[str] = None
    end_time: Optional[str] = None

    class Config:
        from_attributes = True