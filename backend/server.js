const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management';
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Database Connection Troubleshooting:');
      console.log('1. For local MongoDB: Make sure MongoDB is installed and running');
      console.log('   - Install: https://docs.mongodb.com/manual/installation/');
      console.log('   - Start: mongod --dbpath ./data');
      console.log('2. For MongoDB Atlas: Check your connection string and credentials');
      console.log('3. For development: Consider using MongoDB Memory Server');
      console.log('\n💡 The server will continue running but database operations will fail.\n');
      return;
    }
    
    console.error('Exiting due to database connection failure...');
    process.exit(1);
  }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Management System API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login'
      },
      students: {
        create: 'POST /api/students (admin only)',
        getAll: 'GET /api/students',
        getById: 'GET /api/students/:id',
        update: 'PUT /api/students/:id (admin only)',
        delete: 'DELETE /api/students/:id (admin only)'
      },
      health: 'GET /api/health'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err);

  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
📡 Port: ${PORT}
🌐 API URL: http://localhost:${PORT}
📋 Health Check: http://localhost:${PORT}/api/health
📖 API Docs: http://localhost:${PORT}
  `);
});

module.exports = app;
