from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import files
from app.core.config import settings
from app.core.database import engine
from app.models import Base
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="File Upload/Download API",
    description="A scalable file management system API",
    version="1.0.0"
)

# Get CORS origins from environment variable or use defaults
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
cors_origins_list = [origin.strip() for origin in cors_origins.split(",")]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(files.router, prefix="/api/v1", tags=["files"])

@app.get("/")
async def root():
    return {"message": "File Upload/Download API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 