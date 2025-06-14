# Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- GitHub account
- Netlify account
- MongoDB Atlas account (for production database)
- Backend hosting service account (Heroku, Railway, Render, etc.)

## 🔧 Step-by-Step Deployment

### 1. Create GitHub Repository

1. **Initialize Git in your project**:
   ```bash
   cd "C:\Users\aksha\Desktop\Student Management System"
   git init
   git add .
   git commit -m "Initial commit: Student Management System"
   ```

2. **Create a new repository on GitHub**:
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `student-management-system`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/student-management-system.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy Backend (Choose one option)

#### Option A: Railway (Recommended)
1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose the `backend` folder as root directory
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `PORT`: 8000 (or leave default)
   - `NODE_ENV`: production

#### Option B: Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```
6. Deploy: `git subtree push --prefix backend heroku main`

### 3. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string and update `MONGODB_URI`

### 4. Deploy Frontend to Netlify

#### Method 1: Connect GitHub Repository (Recommended)
1. Go to [Netlify](https://www.netlify.com)
2. Click "New site from Git"
3. Choose GitHub and authorize
4. Select your repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Add environment variables:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.railway.app/api`)
7. Click "Deploy site"

#### Method 2: Manual Deploy
1. Build your frontend locally:
   ```bash
   cd frontend
   npm install
   REACT_APP_API_URL=https://your-backend-url.com/api npm run build
   ```
2. Drag and drop the `build` folder to Netlify

### 5. Configure Domain and SSL

1. **Custom Domain** (Optional):
   - In Netlify dashboard, go to "Domain settings"
   - Add your custom domain
   - Configure DNS settings

2. **SSL Certificate**:
   - Automatically provided by Netlify
   - Ensure "Force HTTPS" is enabled

### 6. Initialize Admin User

After deployment, initialize the admin user:
1. SSH into your backend server (or use Railway/Heroku console)
2. Run: `node initAdmin.js`
3. Or use the API endpoint if available

## 🔍 Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] Database connection works
- [ ] Authentication flow works
- [ ] Admin and student dashboards function
- [ ] All API endpoints respond correctly
- [ ] Error handling works
- [ ] HTTPS is enforced

## 🌐 Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secure-jwt-secret-key
PORT=5000
NODE_ENV=production
```

### Frontend (Netlify Environment Variables)
```env
REACT_APP_API_URL=https://your-backend-api.com/api
```

## 🚨 Security Notes

1. **Never commit `.env` files to Git**
2. **Use strong JWT secrets in production**
3. **Enable HTTPS on both frontend and backend**
4. **Restrict MongoDB IP whitelist in production**
5. **Use environment-specific configurations**

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure backend CORS is configured for your frontend domain
2. **API Connection Issues**: Check `REACT_APP_API_URL` environment variable
3. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
4. **Build Failures**: Check Node.js version compatibility

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors

---

**Your deployed URLs will be:**
- Frontend: `https://your-site-name.netlify.app`
- Backend: `https://your-backend.railway.app` (or your chosen platform)

Remember to update the `REACT_APP_API_URL` environment variable in Netlify with your actual backend URL!
