from sqlalchemy.orm import Session
from models.User import User
from models.Question import Question
from schemas.question import QuestionCreate
from fastapi import HTTPException



def create_question(teacher_id: int, question: QuestionCreate, db: Session):

    db_question = Question(
        question=question.question,
        type=question.type,
        options=question.options,
        true_false_answer=question.true_false_answer,
        correct_answer=question.correct_answer.strip().lower(),
        points=question.points,
        quiz_id=question.quiz_id,
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question