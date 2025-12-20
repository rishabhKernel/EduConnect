const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maxGrade: {
    type: Number,
    default: 100
  },
  gradeType: {
    type: String,
    enum: ['assignment', 'quiz', 'exam', 'project', 'participation', 'other'],
    default: 'assignment'
  },
  comments: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
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

module.exports = mongoose.model('Grade', gradeSchema);

