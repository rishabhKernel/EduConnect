const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    trim: true
  },
  parentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  teacherIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  subjects: [{
    type: String,
    trim: true
  }],
  profilePicture: {
    type: String,
    default: ''
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);

