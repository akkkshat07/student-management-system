const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

router.post('/signup', async (req, res) => {
  try {
    console.log('📝 Signup request received:', req.body);
    const { name, email, password, age, class: studentClass } = req.body;

    if (!name || !email || !password || !age || !studentClass) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, age, and class are required'
      });
    }

    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 100) {
      console.log('❌ Validation failed: Invalid age');
      return res.status(400).json({
        success: false,
        message: 'Age must be a number between 1 and 100'
      });
    }

    console.log('✅ Required fields validated');

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    console.log('✅ Email is unique');

    const user = new User({
      name,
      email,
      password,
      age: ageNumber,
      class: studentClass,
      role: 'student' // Always set role to student for registrations
    });

    console.log('🔧 Creating user with data:', { 
      name, 
      email, 
      age: ageNumber, 
      class: studentClass, 
      role: 'student' 
    });

    await user.save();
    console.log('✅ User saved successfully');

    
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

   
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('🔍 Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    
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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

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
