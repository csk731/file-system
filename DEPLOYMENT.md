# Deployment Guide

This guide covers multiple deployment options for the File Upload/Download System, from simple cloud deployment to production-ready setups.

## 🚀 Quick Deploy Options

### **Option 1: Railway (Recommended for Start)**

**Steps:**
1. **Fork/Clone** this repository
2. **Sign up** at [Railway.app](https://railway.app)
3. **Connect** your GitHub repository
4. **Deploy** - Railway will automatically detect the Docker setup
5. **Set Environment Variables** in Railway dashboard:
   - `DATABASE_URL` (Railway provides PostgreSQL)
   - `SECRET_KEY` (generate a secure key)
   - `CORS_ORIGINS` (your Railway domain)

**Pros:** Free tier, automatic SSL, PostgreSQL included
**Cons:** Limited storage, not suitable for high traffic

### **Option 2: Render**

**Steps:**
1. **Sign up** at [Render.com](https://render.com)
2. **Create New Web Service** from GitHub repo
3. **Configure** using `render.yaml`
4. **Set Environment Variables**
5. **Deploy**

**Pros:** Free tier, good performance, easy setup
**Cons:** Sleeps on free tier, limited bandwidth

### **Option 3: Heroku**

**Steps:**
1. **Install Heroku CLI**
2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:mini
   ```
3. **Set environment variables:**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set DATABASE_URL=$(heroku config:get DATABASE_URL)
   ```
4. **Deploy:**
   ```bash
   git push heroku main
   ```

## 🏭 Production Deployment

### **Option 1: Docker Compose on VPS**

**Prerequisites:**
- VPS with Docker and Docker Compose
- Domain name
- SSL certificate

**Steps:**

1. **Clone repository:**
   ```bash
   git clone <your-repo>
   cd fileUpDown
   ```

2. **Configure environment:**
   ```bash
   cp env.production .env
   # Edit .env with your production values
   ```

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Set up Nginx reverse proxy:**
   ```bash
   # Install Nginx
   sudo apt update && sudo apt install nginx

   # Configure Nginx
   sudo nano /etc/nginx/sites-available/fileupdown
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /path/to/your/cert.pem;
       ssl_certificate_key /path/to/your/key.pem;

       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. **Enable site and restart Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/fileupdown /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### **Option 2: Kubernetes (GKE/AKS/EKS)**

**Prerequisites:**
- Kubernetes cluster
- kubectl configured
- Container registry (Docker Hub, GCR, ECR)

**Steps:**

1. **Build and push images:**
   ```bash
   # Build images
   docker build -t your-registry/fileupdown-backend:latest ./backend
   docker build -t your-registry/fileupdown-frontend:latest ./frontend

   # Push to registry
   docker push your-registry/fileupdown-backend:latest
   docker push your-registry/fileupdown-frontend:latest
   ```

2. **Update Kubernetes manifests:**
   - Edit `k8s/deployment.yaml`
   - Replace `your-registry` with your actual registry
   - Update domain names

3. **Create secrets:**
   ```bash
   kubectl create secret generic fileupdown-secrets \
     --from-literal=database-url="your-db-url" \
     --from-literal=secret-key="your-secret-key"
   ```

4. **Deploy:**
   ```bash
   kubectl apply -f k8s/
   ```

### **Option 3: AWS/GCP/Azure Cloud**

**AWS Example (ECS Fargate):**

1. **Create ECR repositories:**
   ```bash
   aws ecr create-repository --repository-name fileupdown-backend
   aws ecr create-repository --repository-name fileupdown-frontend
   ```

2. **Build and push images:**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   
   docker build -t fileupdown-backend ./backend
   docker tag fileupdown-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/fileupdown-backend:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/fileupdown-backend:latest
   ```

3. **Create ECS cluster and services**
4. **Set up Application Load Balancer**
5. **Configure RDS for PostgreSQL**

## 🔧 Environment Configuration

### **Required Environment Variables:**

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname
POSTGRES_DB=fileupdown_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure-password

# Security
SECRET_KEY=your-very-long-secret-key
CORS_ORIGINS=https://yourdomain.com

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

### **Security Checklist:**

- [ ] Use strong, unique passwords
- [ ] Generate secure SECRET_KEY
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Use managed database service
- [ ] Enable monitoring and logging
- [ ] Set up backups

## 📊 Monitoring and Maintenance

### **Health Checks:**
- Backend: `GET /health`
- Frontend: `GET /`

### **Logs:**
```bash
# Docker Compose
docker-compose logs -f

# Kubernetes
kubectl logs -f deployment/fileupdown-backend
```

### **Backup Strategy:**
1. **Database backups** (daily)
2. **File storage backups** (daily)
3. **Configuration backups** (weekly)

### **Scaling:**
- **Horizontal scaling:** Add more replicas
- **Vertical scaling:** Increase resource limits
- **Database scaling:** Use read replicas
- **Storage scaling:** Use cloud storage (S3, GCS, Azure Blob)

## 🚨 Troubleshooting

### **Common Issues:**

1. **Database connection failed:**
   - Check DATABASE_URL
   - Verify network connectivity
   - Check database credentials

2. **File uploads failing:**
   - Check disk space
   - Verify file permissions
   - Check MAX_FILE_SIZE setting

3. **CORS errors:**
   - Update CORS_ORIGINS
   - Check frontend API_URL

4. **SSL/HTTPS issues:**
   - Verify certificate validity
   - Check Nginx configuration
   - Update CORS origins

### **Performance Optimization:**

1. **Enable gzip compression**
2. **Use CDN for static files**
3. **Implement caching strategies**
4. **Optimize database queries**
5. **Use cloud storage for files**

## 📈 Scaling Considerations

### **For High Traffic:**
- Use managed Kubernetes (GKE, AKS, EKS)
- Implement auto-scaling
- Use cloud storage (S3, GCS, Azure Blob)
- Set up CDN
- Use managed PostgreSQL
- Implement caching (Redis)

### **For Large Files:**
- Use chunked uploads
- Implement resumable uploads
- Use cloud storage
- Set up proper timeout configurations

This deployment guide provides a comprehensive approach to deploying your file upload/download system in various environments, from simple cloud platforms to enterprise-grade Kubernetes clusters. 