#!/bin/bash

# Student Management System - Development Setup Script

echo "🚀 Setting up Student Management System for development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "📦 Installing dependencies..."

# Install backend dependencies
echo "📥 Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
    echo "📝 Creating backend .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual values"
fi
npm install

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
cd ../frontend
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file from example..."
    cp .env.example .env
fi
npm install

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Update frontend/.env if needed"
echo "3. Start MongoDB (if using local instance)"
echo "4. Run 'npm run dev' in the backend directory"
echo "5. Run 'npm start' in the frontend directory"
echo ""
echo "📚 For deployment instructions, see DEPLOYMENT.md"
