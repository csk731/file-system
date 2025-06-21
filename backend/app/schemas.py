from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class FileBase(BaseModel):
    original_filename: str = Field(..., description="Original filename")
    description: Optional[str] = Field(None, description="File description")

class FileCreate(FileBase):
    pass

class FileResponse(FileBase):
    id: int
    file_id: str
    filename: str
    file_size: int
    mime_type: str
    file_extension: str
    upload_date: datetime
    download_url: str
    
    class Config:
        from_attributes = True

class FileListResponse(BaseModel):
    files: List[FileResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

class FileDeleteResponse(BaseModel):
    message: str
    file_id: str

class UploadProgressResponse(BaseModel):
    filename: str
    progress: int
    status: str  # "uploading", "completed", "error"
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None 