from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import files
from app.core.config import settings
from app.core.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="File Upload/Download API",
    description="A scalable file management system API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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