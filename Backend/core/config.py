from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # JWT Settings
    SECRET_KEY: str = "TestKeyForJWTGeneration"
    ALGORITHM: str = "HS256"
    FRONTEND_TOKEN_EXPIRE_HOURS: int = 6
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    @property
    def SQLALCHEMY_DATABASE_URL(self) -> str:
        return "postgresql://postgres:LYidXbvQfvwoBQiHkBPayxdNjpfbuhTo@crossover.proxy.rlwy.net:54596/railway" 
    #should be un .env but i am really tired

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()