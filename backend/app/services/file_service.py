import os
import uuid
import magic
import shutil
from typing import List, Optional
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.models import File
from app.schemas import FileCreate, FileResponse
from app.core.config import settings
import aiofiles
from pathlib import Path

class FileService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_files(self, skip: int = 0, limit: int = 100) -> List[File]:
        """Get paginated list of files"""
        return self.db.query(File).offset(skip).limit(limit).all()
    
    def get_file_by_id(self, file_id: str) -> Optional[File]:
        """Get file by file_id"""
        return self.db.query(File).filter(File.file_id == file_id).first()
    
    def get_file_by_db_id(self, file_id: int) -> Optional[File]:
        """Get file by database id"""
        return self.db.query(File).filter(File.id == file_id).first()
    
    def create_file_record(self, file_data: FileCreate, file_path: str, 
                          file_size: int, mime_type: str, file_extension: str) -> File:
        """Create a new file record in database"""
        db_file = File(
            filename=f"{uuid.uuid4()}{file_extension}",
            original_filename=file_data.original_filename,
            file_path=file_path,
            file_size=file_size,
            mime_type=mime_type,
            file_extension=file_extension,
            description=file_data.description
        )
        self.db.add(db_file)
        self.db.commit()
        self.db.refresh(db_file)
        return db_file
    
    def delete_file(self, file_id: str) -> bool:
        """Delete file from database and filesystem"""
        file_record = self.get_file_by_id(file_id)
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Delete from filesystem
        try:
            if os.path.exists(file_record.file_path):
                os.remove(file_record.file_path)
        except OSError as e:
            # Log error but continue with database deletion
            print(f"Error deleting file from filesystem: {e}")
        
        # Delete from database
        self.db.delete(file_record)
        self.db.commit()
        return True
    
    def validate_file(self, file: UploadFile) -> None:
        """Validate uploaded file"""
        # Check file size
        if hasattr(file, 'size') and file.size and file.size > settings.max_file_size:
            raise HTTPException(
                status_code=413, 
                detail=f"File size exceeds maximum allowed size of {settings.max_file_size} bytes"
            )
        
        # Check file extension
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in settings.allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join(settings.allowed_extensions)}"
            )
    
    async def save_uploaded_file(self, file: UploadFile) -> tuple[str, int, str]:
        """Save uploaded file to filesystem and return file info"""
        # Generate unique filename
        file_extension = Path(file.filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(settings.upload_dir, unique_filename)
        
        # Save file
        file_size = 0
        async with aiofiles.open(file_path, 'wb') as f:
            while chunk := await file.read(8192):  # 8KB chunks
                await f.write(chunk)
                file_size += len(chunk)
        
        # Detect MIME type
        mime_type = magic.from_file(file_path, mime=True)
        
        return file_path, file_size, mime_type
    
    def format_file_size(self, size_bytes: int) -> str:
        """Format file size in human readable format"""
        if size_bytes == 0:
            return "0B"
        
        size_names = ["B", "KB", "MB", "GB", "TB"]
        i = 0
        while size_bytes >= 1024 and i < len(size_names) - 1:
            size_bytes /= 1024.0
            i += 1
        
        return f"{size_bytes:.1f}{size_names[i]}"
    
    def get_total_files_count(self) -> int:
        """Get total number of files"""
        return self.db.query(File).count() 