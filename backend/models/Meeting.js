const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  location: {
    type: String,
    enum: ['in-person', 'online', 'phone'],
    default: 'in-person'
  },
  meetingLink: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  requestedBy: {
    type: String,
    enum: ['parent', 'teacher'],
    required: true
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

module.exports = mongoose.model('Meeting', meetingSchema);

