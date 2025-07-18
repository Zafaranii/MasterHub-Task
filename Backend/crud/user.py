from sqlalchemy.orm import Session
from models.User import User
from schemas.user import UserCreate
from core.security import hash_password, create_frontend_token, create_refresh_frontend_token


def get_user_by_username(username: str, db: Session):
    return db.query(User).filter(User.username == username).first()

def signup_User(user: UserCreate, db: Session):
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        username=user.username,
        is_teacher=user.is_teacher, 
        hashed_password=hash_password(user.password),
        grade = user.grade
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    frontend_token = create_frontend_token({"sub": db_user.username})
    refresh_token = create_refresh_frontend_token({"sub": db_user.username})
    return db_user, frontend_token, refresh_token