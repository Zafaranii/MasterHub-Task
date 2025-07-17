from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlmodel import Field, SQLModel
from database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, default=None, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_teacher = Column(Boolean, default=False)
    full_name = Column(String, nullable=False)
    grade = Column(Integer, nullable = True)