@echo off
REM Student Management System - Development Setup Script for Windows

echo 🚀 Setting up Student Management System for development...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

REM Install backend dependencies
echo 📥 Installing backend dependencies...
cd backend
if not exist ".env" (
    echo 📝 Creating backend .env file from example...
    copy .env.example .env
    echo ⚠️  Please update the .env file with your actual values
)
call npm install

REM Install frontend dependencies
echo 📥 Installing frontend dependencies...
cd ..\frontend
if not exist ".env" (
    echo 📝 Creating frontend .env file from example...
    copy .env.example .env
)
call npm install

cd ..

echo ✅ Setup complete!
echo.
echo 🔧 Next steps:
echo 1. Update backend\.env with your MongoDB URI and JWT secret
echo 2. Update frontend\.env if needed
echo 3. Start MongoDB (if using local instance)
echo 4. Run 'npm run dev' in the backend directory
echo 5. Run 'npm start' in the frontend directory
echo.
echo 📚 For deployment instructions, see DEPLOYMENT.md

pause
