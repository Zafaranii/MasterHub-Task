from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.Quiz import Quiz
from datetime import datetime, timezone
from models.User import User
from database import Base



class QuizSession(Base):
    __tablename__ = 'quiz_sessions'

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quiz.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    score = Column(Integer, nullable=True)

    quiz = relationship("Quiz")
    student = relationship("User")
    answers = relationship("Answer", back_populates="submission", cascade="all, delete-orphan")

