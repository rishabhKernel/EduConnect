const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Student = require('../models/Student');

// @route   GET /api/meetings
// @desc    Get meetings (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    const { status, startDate, endDate } = req.query;

    // Parents can see meetings they're involved in
    if (req.user.role === 'parent') {
      query.parentId = req.user._id;
    }
    // Teachers can see meetings they're involved in
    else if (req.user.role === 'teacher') {
      query.teacherId = req.user._id;
    }

    if (status) query.status = status;
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }

    const meetings = await Meeting.find(query)
      .populate('parentId', 'firstName lastName email phone')
      .populate('teacherId', 'firstName lastName email phone')
      .populate('studentId', 'firstName lastName studentId grade')
      .sort({ scheduledDate: 1 });

    res.json(meetings);
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/meetings/:id
// @desc    Get single meeting
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('parentId', 'firstName lastName email phone')
      .populate('teacherId', 'firstName lastName email phone')
      .populate('studentId', 'firstName lastName studentId');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check access
    if (req.user.role === 'parent' && meeting.parentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'teacher' && meeting.teacherId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(meeting);
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/meetings
// @desc    Create meeting request
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, parentId, teacherId, studentId, scheduledDate, duration, location, meetingLink, notes } = req.body;

    // Validate participants
    if (req.user.role === 'parent') {
      if (parentId && parentId !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only create meetings as yourself' });
      }
      // Verify student belongs to parent
      const student = await Student.findById(studentId);
      if (!student || !student.parentIds.includes(req.user._id)) {
        return res.status(403).json({ message: 'Student not associated with your account' });
      }
    } else if (req.user.role === 'teacher') {
      if (teacherId && teacherId !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only create meetings as yourself' });
      }
    }

    const meeting = new Meeting({
      title,
      description,
      parentId: parentId || (req.user.role === 'parent' ? req.user._id : null),
      teacherId: teacherId || (req.user.role === 'teacher' ? req.user._id : null),
      studentId,
      scheduledDate,
      duration: duration || 30,
      location: location || 'in-person',
      meetingLink,
      notes,
      requestedBy: req.user.role
    });

    await meeting.save();
    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate('parentId', 'firstName lastName email phone')
      .populate('teacherId', 'firstName lastName email phone')
      .populate('studentId', 'firstName lastName studentId');

    res.status(201).json(populatedMeeting);
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/meetings/:id
// @desc    Update meeting
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check access
    const isParent = req.user.role === 'parent' && meeting.parentId.toString() === req.user._id.toString();
    const isTeacher = req.user.role === 'teacher' && meeting.teacherId.toString() === req.user._id.toString();

    if (!isParent && !isTeacher && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(meeting, req.body, { updatedAt: Date.now() });
    await meeting.save();

    const updatedMeeting = await Meeting.findById(meeting._id)
      .populate('parentId', 'firstName lastName email phone')
      .populate('teacherId', 'firstName lastName email phone')
      .populate('studentId', 'firstName lastName studentId');

    res.json(updatedMeeting);
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/meetings/:id/status
// @desc    Update meeting status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const isParent = req.user.role === 'parent' && meeting.parentId.toString() === req.user._id.toString();
    const isTeacher = req.user.role === 'teacher' && meeting.teacherId.toString() === req.user._id.toString();

    if (!isParent && !isTeacher && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    meeting.status = status;
    meeting.updatedAt = Date.now();
    await meeting.save();

    const updatedMeeting = await Meeting.findById(meeting._id)
      .populate('parentId', 'firstName lastName email phone')
      .populate('teacherId', 'firstName lastName email phone')
      .populate('studentId', 'firstName lastName studentId');

    res.json(updatedMeeting);
  } catch (error) {
    console.error('Update meeting status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/meetings/:id
// @desc    Delete meeting
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const isParent = req.user.role === 'parent' && meeting.parentId.toString() === req.user._id.toString();
    const isTeacher = req.user.role === 'teacher' && meeting.teacherId.toString() === req.user._id.toString();

    if (!isParent && !isTeacher && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await meeting.deleteOne();
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

