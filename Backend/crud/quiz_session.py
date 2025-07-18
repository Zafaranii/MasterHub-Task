from sqlalchemy.orm import Session
from models.User import User
from models.QuizSession import QuizSession
from schemas.quizsession import QuizSessionCreate
from schemas.answer import AnswerUpdate
from crud.answer import create_answer as answer_create
from crud.answer import verify_answer
from models.Quiz import Quiz
from fastapi import HTTPException


def create_quiz_session(quiz_session: QuizSessionCreate, db: Session, student_id: int):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_session.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if db.query(QuizSession).filter(QuizSession.quiz_id == quiz_session.quiz_id, QuizSession.student_id == student_id).first():
        raise HTTPException(status_code=400, detail="You have already submitted this quiz")
    score = verify_answer(quiz_session, db)

    db_quiz_session = QuizSession(
        quiz_id=quiz_session.quiz_id,
        student_id=student_id,
        score=score,
    )
    db.add(db_quiz_session)
    db.flush()
    
    # Create answers
    for ans in quiz_session.answers:
        create_answer = AnswerUpdate(
            question_id=ans.question_id,
            answer_text=ans.answer_text,
            quiz_session_id=db_quiz_session.id
        )
        answer_create(create_answer, db)

    db.commit()
    db.refresh(db_quiz_session)  # Refresh to get all data
    return db_quiz_session

def get_quiz_sessions_by_teacher(teacher_id: int, db: Session, quiz_id: int):
    sessions = db.query(QuizSession).join(Quiz).filter(
        Quiz.user_id == teacher_id,
        QuizSession.quiz_id == quiz_id
    ).all()
    return sessions

def get_score(student_id: int, db: Session, quiz_id : int):
    session = db.query(QuizSession).filter(QuizSession.student_id == student_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="No submission found for this student")
    return session