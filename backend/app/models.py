from sqlalchemy import Column, Integer, String, DateTime, BigInteger, Text
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class File(Base):
    __tablename__ = "files"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_extension = Column(String(20), nullable=False)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    description = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<File(id={self.id}, filename='{self.filename}', size={self.file_size})>" 