#!/bin/bash

echo "🚀 Setting up File Upload/Download System"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create environment files
echo "📝 Creating environment files..."

# Backend environment
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists"
fi

# Frontend environment
if [ ! -f frontend/.env ]; then
    cp frontend/env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "⚠️  frontend/.env already exists"
fi

# Create uploads directory
mkdir -p backend/uploads
echo "✅ Created uploads directory"

echo ""
echo "🔧 Starting services with Docker Compose..."
echo "This may take a few minutes on first run..."

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U postgres; do
    sleep 2
done

echo "✅ PostgreSQL is ready"

# Wait for backend to be ready
echo "Waiting for backend..."
until curl -f http://localhost:8000/health > /dev/null 2>&1; do
    sleep 2
done

echo "✅ Backend is ready"

# Wait for frontend to be ready
echo "Waiting for frontend..."
until curl -f http://localhost:3000 > /dev/null 2>&1; do
    sleep 2
done

echo "✅ Frontend is ready"

echo ""
echo "🎉 Setup complete!"
echo "=================="
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "📁 Upload directory: backend/uploads"
echo ""
echo "To stop the services:"
echo "  docker-compose down"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To restart services:"
echo "  docker-compose restart" 