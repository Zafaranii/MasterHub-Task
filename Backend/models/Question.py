import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean, ARRAY, JSON
from database import Base
from sqlalchemy.orm import relationship
from datetime import datetime, timezone


class QuestionType(str, enum.Enum):
    MCQ = "MCQ"
    TRUE_FALSE = "TRUE_FALSE"
    SHORT_ANSWER = "SHORT_ANSWER"

class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey('quiz.id'), nullable=False)
    question = Column(String, nullable=False)
    type = Column(Enum(QuestionType), nullable=False)
    options = Column(JSON, nullable=True)
    true_false_answer = Column(Boolean, nullable=True)
    correct_answer = Column(String, nullable=True)
    points = Column(Integer, default=1)

    
    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")