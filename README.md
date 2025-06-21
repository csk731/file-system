# File Upload/Download System

A scalable, extensible, and maintainable file management system built with React, FastAPI, and PostgreSQL.

## Features

- **File Upload**: Drag & drop interface with progress tracking
- **File Download**: Secure file downloads with proper headers
- **File Management**: View, delete, and manage uploaded files
- **Scalable Architecture**: Designed for horizontal scaling
- **Extensible**: Easy to add new features like user authentication, file sharing, etc.
- **Maintainable**: Clean code structure with proper separation of concerns

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: FastAPI + Python 3.11+
- **Database**: PostgreSQL 14+
- **File Storage**: Local filesystem (easily extensible to S3, etc.)

## Project Structure

```
fileUpDown/
├── frontend/          # React application
├── backend/           # FastAPI application
├── database/          # Database migrations and schemas
├── docker-compose.yml # Development environment
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and setup:**
   ```bash
   git clone <repository>
   cd fileUpDown
   ```

2. **Start with Docker (Recommended):**
   ```bash
   docker-compose up -d
   ```

3. **Manual Setup:**
   ```bash
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload

   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup:**
   ```bash
   # Create database
   createdb fileupdown_db
   
   # Run migrations
   cd backend
   alembic upgrade head
   ```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```
DATABASE_URL=postgresql://user:password@localhost/fileupdown_db
SECRET_KEY=your-secret-key-here
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=100MB
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License 