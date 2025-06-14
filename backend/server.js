const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-netlify-site.netlify.app',
        'https://your-custom-domain.com'
      ]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
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
