from datetime import datetime, timezone
from models.Question import Question
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Quiz(Base):
    __tablename__ = 'quiz'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    duration = Column(Integer, default=0)  # Duration in minutes

    questions = relationship("Question", back_populates="quiz", primaryjoin="Question.quiz_id == Quiz.id", foreign_keys="Question.quiz_id")
    user_id = Column(Integer, ForeignKey("users.id"))

    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)

    grade = Column(Integer, ForeignKey("users.grade"))