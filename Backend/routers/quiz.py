from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db 
from schemas.quiz import  QuizCreate, QuizResponse, QuizResponseOfIds
from models.User import User
from core.security import get_current_user
from crud.quiz import create_quiz as quiz_create, get_quizzes_by_teacher
from models.Quiz import Quiz
from models.QuizSession import QuizSession


router = APIRouter(prefix="/quizzes", tags=["quizzes"])

@router.post("/create-quiz", response_model=QuizResponse)
def create_quiz(quiz: QuizCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Only teachers can create quizzes")
    return quiz_create(current_user.id, quiz, db)

@router.get("/get-quizzes", response_model=List[QuizResponse])
def get_quizzes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Only teachers can view quizzes")
    return get_quizzes_by_teacher(current_user.id, db)

@router.get("/get-quizzes-for-student", response_model=List[QuizResponseOfIds])
def get_get_quizzes_for_students(db: Session =Depends(get_db), current_user: User = Depends(get_current_user)):
    quizes = db.query(Quiz).filter(Quiz.grade == current_user.grade)
    return quizes

@router.get("/get-quiz/{quiz_id}", response_model=QuizResponse)
def get_quiz(quiz_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz