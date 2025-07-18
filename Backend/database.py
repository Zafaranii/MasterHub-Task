from fastapi import FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


engine = create_engine("postgresql://postgres:LYidXbvQfvwoBQiHkBPayxdNjpfbuhTo@crossover.proxy.rlwy.net:54596/railway")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()