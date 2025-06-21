# Railway Deployment Guide

This guide will walk you through deploying your File Upload/Download System to Railway.

## 🚀 Quick Deploy Steps

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Make sure these files are in your repository:**
   - `Dockerfile.railway` ✅
   - `railway.json` ✅
   - `railway-start.sh` ✅
   - `frontend/nginx.conf` ✅
   - `railway.env.example` ✅

### **Step 2: Deploy to Railway**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will automatically detect the setup and start building**

### **Step 3: Configure Environment Variables**

1. **Go to your project dashboard**
2. **Click on "Variables" tab**
3. **Add these environment variables:**

   ```bash
   # Security (REQUIRED)
   SECRET_KEY=your-super-secret-key-change-this-in-production
   
   # File Upload Settings
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=104857600
   
   # CORS Settings (update with your Railway domain)
   CORS_ORIGINS=https://your-app-name.railway.app
   
   # Frontend API URL (update with your Railway domain)
   VITE_API_URL=https://your-app-name.railway.app
   ```

4. **Railway will automatically provide:**
   - `DATABASE_URL` (PostgreSQL connection string)
   - `PORT` (Railway assigns this)

### **Step 4: Add PostgreSQL Database**

1. **In your Railway project, click "New"**
2. **Select "Database" → "PostgreSQL"**
3. **Railway will automatically connect it to your app**

### **Step 5: Deploy**

1. **Railway will automatically deploy when you push to GitHub**
2. **Or manually trigger deployment from the dashboard**
3. **Wait for the build to complete (usually 2-5 minutes)**

## 🔧 Configuration Details

### **What Railway Provides:**
- ✅ **Automatic SSL/HTTPS**
- ✅ **PostgreSQL Database**
- ✅ **Custom Domain** (optional)
- ✅ **Environment Variables**
- ✅ **Automatic Deployments**
- ✅ **Logs and Monitoring**

### **Your App Structure:**
```
Railway Container:
├── Backend API (FastAPI) - Port 8000
├── Frontend (React) - Served by Nginx
├── Nginx - Reverse Proxy (Port $PORT)
└── PostgreSQL - External Database
```

## 🌐 Access Your App

Once deployed, you can access your app at:
- **Main App**: `https://your-app-name.railway.app`
- **API Docs**: `https://your-app-name.railway.app/docs`
- **Health Check**: `https://your-app-name.railway.app/health`

## 📊 Monitoring

### **View Logs:**
1. **Go to your Railway project**
2. **Click on your service**
3. **View real-time logs**

### **Check Health:**
```bash
curl https://your-app-name.railway.app/health
```

## 🔄 Updates

### **Automatic Deployments:**
- Push to `main` branch = automatic deployment
- Railway will rebuild and deploy automatically

### **Manual Deployments:**
1. **Go to Railway dashboard**
2. **Click "Deploy" button**

## 🚨 Troubleshooting

### **Build Fails:**
1. **Check logs in Railway dashboard**
2. **Verify all files are committed to GitHub**
3. **Check environment variables**

### **App Not Starting:**
1. **Check health endpoint**
2. **View logs for errors**
3. **Verify database connection**

### **File Upload Issues:**
1. **Check `UPLOAD_DIR` environment variable**
2. **Verify file size limits**
3. **Check disk space in logs**

### **CORS Errors:**
1. **Update `CORS_ORIGINS` with your Railway domain**
2. **Check `VITE_API_URL` in frontend**

## 💰 Pricing

### **Free Tier:**
- 500 hours/month
- 1GB storage
- Shared resources
- Perfect for testing

### **Pro Tier ($5/month):**
- Unlimited hours
- 10GB storage
- Dedicated resources
- Custom domains

## 🔒 Security Notes

1. **Change the `SECRET_KEY`** to a strong, unique value
2. **Update `CORS_ORIGINS`** with your actual domain
3. **Monitor logs** for any security issues
4. **Use HTTPS** (Railway provides this automatically)

## 📈 Scaling

### **Free Tier Limits:**
- 1GB RAM
- Shared CPU
- 1GB storage

### **Pro Tier Benefits:**
- 8GB RAM
- Dedicated CPU
- 10GB storage
- Custom domains

## 🎉 Success!

Once deployed, your File Upload/Download System will be:
- ✅ **Live on the internet**
- ✅ **Automatically secured with SSL**
- ✅ **Connected to PostgreSQL database**
- ✅ **Ready for file uploads/downloads**
- ✅ **Automatically updated on Git pushes**

Your app is now production-ready and accessible worldwide! 