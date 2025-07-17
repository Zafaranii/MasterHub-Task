from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db 
from models.User import User
from core.security import get_current_user
from schemas.question import QuestionCreate, QuestionResponse, QuestionView
from crud.question import create_question  as question_create
from models.Question import Question
from typing import List
from models.QuizSession import QuizSession
from models.Quiz import Quiz
from datetime import datetime, timezone

router = APIRouter(prefix="/questions", tags=["questions"])

@router.post("/create-question", response_model=QuestionResponse)
def create_question(question: QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Only teachers can create questions")
    
    # Assuming a function create_question exists in the crud module
    return question_create(current_user.id, question, db)

@router.get("/get-questions/{quiz_id}", response_model=List[QuestionView])
def get_questions(quiz_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if quiz.end_time != None and quiz.end_time < datetime.now(timezone.utc):
        raise HTTPException(status_code=404, detail="Quiz has ended")
    elif quiz.start_time != None and quiz.start_time > datetime.now(timezone.utc):
        raise HTTPException(status_code=404, detail="Quiz has not started yet")
    
    already_submitted = db.query(QuizSession).filter(
        QuizSession.quiz_id == quiz_id and QuizSession.student_id == current_user.id
    ).first()
    if already_submitted:
        raise HTTPException(status_code=403, detail="You have already submitted this quiz")
    
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this quiz")
    return questions

