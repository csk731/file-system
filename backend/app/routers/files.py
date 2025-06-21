from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
import os

from app.core.database import get_db
from app.services.file_service import FileService
from app.schemas import (
    FileResponse as FileResponseSchema,
    FileListResponse,
    FileDeleteResponse,
    FileCreate,
    ErrorResponse
)
from app.core.config import settings

router = APIRouter()

@router.post("/upload", response_model=FileResponseSchema)
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    description: Optional[str] = Query(None, description="File description"),
    db: Session = Depends(get_db)
):
    """
    Upload a new file
    """
    try:
        file_service = FileService(db)
        
        # Validate file
        file_service.validate_file(file)
        
        # Save file to filesystem
        file_path, file_size, mime_type = await file_service.save_uploaded_file(file)
        
        # Create file record
        file_extension = Path(file.filename).suffix.lower()
        file_data = FileCreate(
            original_filename=file.filename,
            description=description
        )
        
        db_file = file_service.create_file_record(
            file_data, file_path, file_size, mime_type, file_extension
        )
        
        # Prepare response
        response_data = FileResponseSchema(
            id=db_file.id,
            file_id=db_file.file_id,
            filename=db_file.filename,
            original_filename=db_file.original_filename,
            file_size=db_file.file_size,
            mime_type=db_file.mime_type,
            file_extension=db_file.file_extension,
            upload_date=db_file.upload_date,
            description=db_file.description,
            download_url=f"/api/v1/download/{db_file.file_id}"
        )
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/files", response_model=FileListResponse)
async def list_files(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Get paginated list of uploaded files
    """
    try:
        file_service = FileService(db)
        
        # Calculate pagination
        skip = (page - 1) * per_page
        files = file_service.get_files(skip=skip, limit=per_page)
        total = file_service.get_total_files_count()
        total_pages = (total + per_page - 1) // per_page
        
        # Prepare response
        file_responses = []
        for file in files:
            file_response = FileResponseSchema(
                id=file.id,
                file_id=file.file_id,
                filename=file.filename,
                original_filename=file.original_filename,
                file_size=file.file_size,
                mime_type=file.mime_type,
                file_extension=file.file_extension,
                upload_date=file.upload_date,
                description=file.description,
                download_url=f"/api/v1/download/{file.file_id}"
            )
            file_responses.append(file_response)
        
        return FileListResponse(
            files=file_responses,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve files: {str(e)}")

@router.get("/files/{file_id}", response_model=FileResponseSchema)
async def get_file_info(
    file_id: str,
    db: Session = Depends(get_db)
):
    """
    Get file information by file ID
    """
    try:
        file_service = FileService(db)
        file = file_service.get_file_by_id(file_id)
        
        if not file:
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponseSchema(
            id=file.id,
            file_id=file.file_id,
            filename=file.filename,
            original_filename=file.original_filename,
            file_size=file.file_size,
            mime_type=file.mime_type,
            file_extension=file.file_extension,
            upload_date=file.upload_date,
            description=file.description,
            download_url=f"/api/v1/download/{file.file_id}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve file info: {str(e)}")

@router.get("/download/{file_id}")
async def download_file(
    file_id: str,
    db: Session = Depends(get_db)
):
    """
    Download a file by file ID
    """
    try:
        file_service = FileService(db)
        file = file_service.get_file_by_id(file_id)
        
        if not file:
            raise HTTPException(status_code=404, detail="File not found")
        
        if not os.path.exists(file.file_path):
            raise HTTPException(status_code=404, detail="File not found on disk")
        
        return FileResponse(
            path=file.file_path,
            filename=file.original_filename,
            media_type=file.mime_type
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@router.delete("/files/{file_id}", response_model=FileDeleteResponse)
async def delete_file(
    file_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a file by file ID
    """
    try:
        file_service = FileService(db)
        file_service.delete_file(file_id)
        
        return FileDeleteResponse(
            message="File deleted successfully",
            file_id=file_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """
    Get file upload statistics
    """
    try:
        file_service = FileService(db)
        total_files = file_service.get_total_files_count()
        
        # Calculate total size
        files = file_service.get_files()
        total_size = sum(file.file_size for file in files)
        
        return {
            "total_files": total_files,
            "total_size_bytes": total_size,
            "total_size_formatted": file_service.format_file_size(total_size),
            "max_file_size": settings.max_file_size,
            "allowed_extensions": settings.allowed_extensions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}") 