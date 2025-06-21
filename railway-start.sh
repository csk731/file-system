#!/bin/bash

# Start the backend API in the background
cd /app/backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &

# Wait a moment for the backend to start
sleep 5

# Start nginx to serve the frontend and proxy API requests
nginx -g "daemon off;" 