const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const { authenticate, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

router.post('/', adminOnly, async (req, res) => {
  try {
    console.log('📝 Add student request received:', req.body);
    const { name, email, age, class: studentClass } = req.body;

    if (!name || !email || !age || !studentClass) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, age, and class are required'
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

    const student = new Student({
      name,
      email,
      age: ageNumber,
      class: studentClass,
      createdBy: req.user.userId
    });

    console.log('🔧 Creating student with data:', { 
      name, 
      email, 
      age: ageNumber, 
      class: studentClass 
    });

    await student.save();
    console.log('✅ Student saved successfully');

    await student.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    console.error('❌ Create student error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('🔍 Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating student'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    let studentQuery = {};
    
    if (req.user.role === 'user') {
      studentQuery.createdBy = req.user.userId;
    }

    const manualStudents = await Student.find(studentQuery)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    
    const registeredStudents = await User.find({ role: 'student' })
      .select('name email age class createdAt')
      .sort({ createdAt: -1 });

    console.log('🔍 Debug - Manual students found:', manualStudents.length);
    console.log('🔍 Debug - Registered students found:', registeredStudents.length);
    console.log('🔍 Debug - Registered students:', registeredStudents.map(u => ({ 
      name: u.name, 
      email: u.email, 
      age: u.age, 
      class: u.class 
    })));

   
    const formattedRegisteredStudents = registeredStudents.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      class: user.class,
      createdAt: user.createdAt,
      source: 'registration' 
    }));

    
    const formattedManualStudents = manualStudents.map(student => ({
      ...student.toObject(),
      source: 'manual'
    }));

   
    const allStudents = [...formattedManualStudents, ...formattedRegisteredStudents];
    
    
    allStudents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('🔍 Debug - Total combined students:', allStudents.length);
    console.log('🔍 Debug - Combined student names:', allStudents.map(s => ({ name: s.name, source: s.source })));

    res.json({
      success: true,
      message: 'Students retrieved successfully',
      data: allStudents,
      count: allStudents.length,
      breakdown: {
        manual: formattedManualStudents.length,
        registered: formattedRegisteredStudents.length
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving students'
    });  }
});


router.get('/user/:id', adminOnly, async (req, res) => {
  try {
    console.log('📝 Get user request received for ID:', req.params.id);
    
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      console.log('❌ User not found:', id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User found:', user.name);
    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('❌ Get user error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving user'
    });
  }
});

router.put('/user/:id', adminOnly, async (req, res) => {
  try {
    console.log('📝 Update user request received:', req.body);
    const { id } = req.params;
    const { name, email, age, class: studentClass } = req.body;

    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (studentClass !== undefined) updateData.class = studentClass;

    console.log('🔧 Update data:', updateData);

    
    if (Object.keys(updateData).length === 0) {
      console.log('❌ No valid fields provided for update');
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!user) {
      console.log('❌ User not found:', id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User updated successfully');
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('❌ Update user error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

   
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('🔍 Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating user'
    });
  }
});


router.delete('/user/:id', adminOnly, async (req, res) => {
  try {
    console.log('📝 Delete user request received for ID:', req.params.id);
    
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      console.log('❌ User not found:', id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User deleted successfully:', user.name);
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: { deletedUser: user.name }
    });
  } catch (error) {
    console.error('❌ Delete user error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting user'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let query = { _id: id };
    
    if (req.user.role === 'user') {
      query.createdBy = req.user.userId;
    }

    const student = await Student.findOne(query)
      .populate('createdBy', 'name email role');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Student retrieved successfully',
      data: student
    });
  } catch (error) {
    console.error('Get student error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving student'
    });
  }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    console.log('📝 Update student request received:', req.body);
    const { id } = req.params;
    const { name, email, age, class: studentClass } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (studentClass !== undefined) updateData.class = studentClass;

    console.log('🔧 Update data:', updateData);

    if (Object.keys(updateData).length === 0) {
      console.log('❌ No valid fields provided for update');
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update'
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('createdBy', 'name email role');

    if (!student) {
      console.log('❌ Student not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    console.log('✅ Student updated successfully');
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('❌ Update student error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('🔍 Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating student'
    });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully',
      data: {
        deletedStudent: {
          id: student._id,
          name: student.name,
          age: student.age,
          class: student.class
        }
      }
    });
  } catch (error) {
    console.error('Delete student error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting student'
    });  }
});

module.exports = router;
