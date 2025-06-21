from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:password@localhost/fileupdown_db"
    
    # Security
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File upload settings
    upload_dir: str = "./uploads"
    max_file_size: int = 104857600  # 100MB in bytes
    allowed_extensions: list = [
        ".txt", ".pdf", ".doc", ".docx", ".xls", ".xlsx", 
        ".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mp3",
        ".zip", ".rar", ".tar", ".gz"
    ]
    
    # API settings
    api_v1_str: str = "/api/v1"
    project_name: str = "File Upload/Download System"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.upload_dir, exist_ok=True) 