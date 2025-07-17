from fastapi import FastAPI, Request, APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserLogin
from database import get_db
from crud.user import get_user_by_username, signup_User
from core.security import create_frontend_token, create_refresh_frontend_token, verify_password, get_current_user
from models.User import User

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_username(user.username, db):
        raise HTTPException(status_code=400, detail="Username already registered")
    return signup_User(user, db)

@router.post("/login")
def login( 
          form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = get_user_by_username(form_data.username, db)
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        print(form_data.username,form_data.password)
        raise HTTPException(status_code=400, detail="Invalid username or password")
    frontend_token = create_frontend_token(data ={"sub": db_user.username})
    refresh_token = create_refresh_frontend_token(data = {"sub": db_user.username})
    return { "access_token": frontend_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.get("/me", response_model = UserLogin )
def get_me(current_user: User = Depends(get_current_user)):
    return current_user