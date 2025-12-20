const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  dueDate: {
    type: Date,
    required: true
  },
  maxGrade: {
    type: Number,
    default: 100
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'published'
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

module.exports = mongoose.model('Assignment', assignmentSchema);

