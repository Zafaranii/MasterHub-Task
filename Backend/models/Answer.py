from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class Answer(Base):
    __tablename__ = 'answers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    submission_id = Column(Integer, ForeignKey('quiz_sessions.id'), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    submitted_answer = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    submission = relationship("QuizSession", back_populates="answers")
    question = relationship("Question")