# Quick Start Guide

Get the File Upload/Download System running in minutes!

## Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

## Option 1: One-Command Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd fileUpDown

# Run the setup script
./setup.sh
```

The setup script will:
- ✅ Check Docker installation
- ✅ Create environment files
- ✅ Start all services
- ✅ Wait for services to be ready
- ✅ Display access URLs

## Option 2: Manual Setup

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd fileUpDown
```

### 2. Create Environment Files
```bash
# Backend environment
cp backend/env.example backend/.env

# Frontend environment  
cp frontend/env.example frontend/.env
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Wait for Services
Wait a few minutes for all services to start up completely.

## Access Your Application

Once setup is complete, you can access:

- **🌐 Frontend**: http://localhost:3000
- **🔧 Backend API**: http://localhost:8000
- **📚 API Documentation**: http://localhost:8000/docs

## First Steps

1. **Upload Files**: Go to the Upload tab and drag & drop files
2. **View Files**: Check the Files tab to see uploaded files
3. **Download Files**: Click the download icon next to any file
4. **View Stats**: Check the Stats tab for system information

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild and start
docker-compose up -d --build
```

## Troubleshooting

### Services Not Starting
```bash
# Check if ports are available
lsof -i :3000
lsof -i :8000
lsof -i :5432

# Check Docker logs
docker-compose logs
```

### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

### File Upload Issues
- Check file size (max 100MB)
- Ensure file type is allowed
- Check backend logs: `docker-compose logs backend`

## Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Update `.env` files with production values
2. **Database**: Use managed PostgreSQL service
3. **File Storage**: Use cloud storage (S3, GCS, etc.)
4. **SSL/TLS**: Add HTTPS certificates
5. **Monitoring**: Add logging and monitoring

## Support

- Check the [README.md](README.md) for detailed documentation
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- API documentation available at http://localhost:8000/docs

## Next Steps

- Add user authentication
- Configure cloud storage
- Set up monitoring and logging
- Add file sharing features
- Implement file versioning

Happy uploading! 🚀 