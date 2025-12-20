const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @route   GET /api/attendance
// @desc    Get attendance records (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    const { studentId, startDate, endDate, status, subject } = req.query;

    // Parents can only see their children's attendance
    if (req.user.role === 'parent') {
      const students = await Student.find({ _id: { $in: req.user.associatedIds } });
      const studentIds = students.map(s => s._id);
      query.studentId = { $in: studentIds };
    }
    // Teachers can see attendance they recorded
    else if (req.user.role === 'teacher') {
      query.teacherId = req.user._id;
    }

    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'firstName lastName studentId grade')
      .populate('teacherId', 'firstName lastName')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance
// @desc    Create attendance record
// @access  Private (Teacher/Admin)
router.post('/', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { studentId, date, status, subject, notes } = req.body;

    // Parse the date to ensure consistent date format (YYYY-MM-DD)
    const dateObj = new Date(date);
    const dateString = dateObj.toISOString().split('T')[0];
    const startOfDay = new Date(dateString + 'T00:00:00Z');
    const endOfDay = new Date(dateString + 'T23:59:59Z');

    // Check if attendance already exists for this student on this date AND same subject
    const existing = await Attendance.findOne({
      studentId,
      date: { $gte: startOfDay, $lte: endOfDay },
      subject: subject || ''
    });

    if (existing) {
      return res.status(400).json({ message: `Attendance already recorded for ${subject} on this date` });
    }

    const attendance = new Attendance({
      studentId,
      teacherId: req.user._id,
      date: startOfDay,
      status,
      subject: subject || '',
      notes
    });

    await attendance.save();
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'firstName lastName');

    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error('Create attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/attendance/:id
// @desc    Update attendance record
// @access  Private (Teacher/Admin)
router.put('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (req.user.role !== 'admin' && attendance.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(attendance, req.body, { updatedAt: Date.now() });
    await attendance.save();

    const updatedAttendance = await Attendance.findById(attendance._id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'firstName lastName');

    res.json(updatedAttendance);
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/attendance/:id
// @desc    Delete attendance record
// @access  Private (Teacher/Admin)
router.delete('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (req.user.role !== 'admin' && attendance.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await attendance.deleteOne();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

