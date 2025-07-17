from sqlalchemy.orm import Session

from models.Answer import Answer
from schemas.answer import AnswerCreate
from models.Question import Question
from schemas.quizsession import QuizSessionCreate


def create_answer(answer: AnswerCreate, db: Session):
    db_answer = Answer(
        question_id=answer.question_id,
        submitted_answer=answer.answer_text,
        submission_id=answer.quiz_session_id,
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

def verify_answer(request: QuizSessionCreate, db: Session):
    question_ids = [answer.question_id for answer in request.answers]
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    question_map = {q.id: q for q in questions}

    score = 0

    for answer in request.answers:
        question = question_map.get(answer.question_id)
        submitted = str(answer.answer_text).strip().lower()

        if question.type == "MCQ" or question.type == "SHORT_ANSWER":
            answer = str(question.correct_answer).strip().lower()
            if submitted == answer:
                score += question.points
        elif question.type == "TRUE_FALSE":
            answer = question.true_false_answer
            if submitted in ["true", "false"]:
                if str(answer).lower() == submitted:
                    score += question.points

    return score