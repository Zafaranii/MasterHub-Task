from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db 
from models.User import User
from core.security import get_current_user
from schemas.quizsession import QuizSessionCreate, QuizSessionScore, QuizSessionResponse
from crud.quiz_session import create_quiz_session as quiz_session_create, get_quiz_sessions_by_teacher, get_score
from models.Quiz import Quiz

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("/create-submission", response_model=QuizSessionResponse)
def create_submission(quiz_session: QuizSessionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Only students can make submissions")
    
    quiz_session_ = quiz_session_create(quiz_session, db, current_user.id)
    return quiz_session

@router.get("/get-submissions/{quiz_id}", response_model=List[QuizSessionResponse])
def get_submissions(quiz_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Only teachers can view submissions")

    quizes_for_teacher = db.query(Quiz).filter(Quiz.user_id == current_user.id, Quiz.id == quiz_id).all()

    if not quizes_for_teacher:
        raise HTTPException(status_code=404, detail="this quiz does not belong to this teacher")

    quiz_sessions = get_quiz_sessions_by_teacher(current_user.id, db, quiz_id)
    if not quiz_sessions:
        raise HTTPException(status_code=404, detail="No submissions found for this quiz")
    
    return quiz_sessions

@router.get("/get-submission/{quiz_id}", response_model=QuizSessionScore)
def get_submission(quiz_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_score(current_user.id, db)