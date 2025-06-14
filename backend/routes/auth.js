const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// POST /signup - Register a new user
router.post('/signup', async (req, res) => {
  try {
    console.log('📝 Signup request received:', req.body);
    const { name, email, password, age, class: studentClass, role, adminCode } = req.body;

    // Validate required fields
    if (!name || !email || !password || !age || !studentClass) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, age, and class are required'
      });
    }

    // Validate admin registration
    if (role === 'admin') {
      const validAdminCode = process.env.ADMIN_INVITE_CODE || 'ADMIN123SECURE';
      
      if (!adminCode) {
        console.log('❌ Admin registration failed: No admin code provided');
        return res.status(400).json({
          success: false,
          message: 'Admin invite code is required for admin registration'
        });
      }
      
      if (adminCode !== validAdminCode) {
        console.log('❌ Admin registration failed: Invalid admin code');
        return res.status(401).json({
          success: false,
          message: 'Invalid admin invite code'
        });
      }
      
      console.log('✅ Valid admin invite code provided');
    }

    // Validate age
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 100) {
      console.log('❌ Validation failed: Invalid age');
      return res.status(400).json({
        success: false,
        message: 'Age must be a number between 1 and 100'
      });
    }

    console.log('✅ Required fields validated');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    console.log('✅ Email is unique');

    // Create new user
    const user = new User({
      name,
      email,
      password,
      age: ageNumber,
      class: studentClass,
      role: role || 'student' // Default to 'student' if role not provided
    });

    console.log('🔧 Creating user with data:', { 
      name, 
      email, 
      age: ageNumber, 
      class: studentClass, 
      role: role || 'student' 
    });

    await user.save();
    console.log('✅ User saved successfully');

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        class: user.class,
        role: user.role,
        token
      }
    });} catch (error) {
    console.error('❌ Signup error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('🔍 Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key error (email uniqueness)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// POST /login - Authenticate user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

module.exports = router;
