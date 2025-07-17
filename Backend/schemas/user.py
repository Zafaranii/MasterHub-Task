from pydantic import BaseModel, EmailStr
from typing import Optional



class UserCreate(BaseModel):
    email: Optional[EmailStr]
    password: str
    full_name: str
    is_teacher: bool = False
    username: str
    grade: Optional[int] = None

class UserLogin(BaseModel):
    email: Optional[EmailStr]
    full_name: str
    is_teacher: bool = False
    username: str