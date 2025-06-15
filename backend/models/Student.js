const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be a positive number'],
    max: [100, 'Age must be less than 100']
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true,
    minlength: [1, 'Class cannot be empty']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'CreatedBy field is required']
  }
}, {
  timestamps: true
});


studentSchema.index({ createdBy: 1 });
studentSchema.index({ name: 1 });

module.exports = mongoose.model('Student', studentSchema);
