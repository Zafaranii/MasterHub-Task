from sqlalchemy.orm import Session
from models.User import User
from schemas.quiz import QuizCreate
from models.Quiz import Quiz
from fastapi import HTTPException
from datetime import datetime, timezone

def create_quiz(teacher_id: int, quiz: QuizCreate, db: Session):
    db_quiz = Quiz(
        title=quiz.title,
        duration=quiz.duration,
        user_id=teacher_id,
        grade = quiz.grade
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def get_quizzes_by_teacher(teacher_id: int, db: Session):
    quizzes = db.query(Quiz).filter(Quiz.user_id == teacher_id).all()
    if not quizzes:
        raise HTTPException(status_code=404, detail="No quizzes found for this teacher")
    return quizzes

def get_quiz(quiz_id: int, db: Session):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    if quiz.end_time != None and quiz.end_time < datetime.now(timezone.utc):
        raise HTTPException(status_code=404, detail="Quiz has ended")
    elif quiz.start_time != None and quiz.start_time > datetime.now(timezone.utc):
        raise HTTPException(status_code=404, detail="Quiz has not started yet")
    

    return quiz