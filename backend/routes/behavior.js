const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Behavior = require('../models/Behavior');
const Student = require('../models/Student');

// @route   GET /api/behavior
// @desc    Get behavior reports (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    const { studentId, type, category, startDate, endDate, subject } = req.query;

    // Parents can only see their children's behavior reports
    if (req.user.role === 'parent') {
      const students = await Student.find({ _id: { $in: req.user.associatedIds } });
      const studentIds = students.map(s => s._id);
      query.studentId = { $in: studentIds };
    }
    // Teachers can see behavior reports they created
    else if (req.user.role === 'teacher') {
      query.teacherId = req.user._id;
    }

    if (studentId) query.studentId = studentId;
    if (type) query.type = type;
    if (category) query.category = category;
    if (subject) query.subject = subject;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const behaviors = await Behavior.find(query)
      .populate('studentId', 'firstName lastName studentId grade')
      .populate('teacherId', 'firstName lastName')
      .sort({ date: -1 });

    res.json(behaviors);
  } catch (error) {
    console.error('Get behavior reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/behavior/:id
// @desc    Get single behavior report
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const behavior = await Behavior.findById(req.params.id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'firstName lastName');

    if (!behavior) {
      return res.status(404).json({ message: 'Behavior report not found' });
    }

    res.json(behavior);
  } catch (error) {
    console.error('Get behavior report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/behavior
// @desc    Create behavior report
// @access  Private (Teacher/Admin)
router.post('/', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { studentId, type, category, title, description, date, severity, subject } = req.body;

    const behavior = new Behavior({
      studentId,
      teacherId: req.user._id,
      type,
      category,
      title,
      description,
      date: date || Date.now(),
      severity: severity || 'medium',
      subject
    });

    await behavior.save();
    const populatedBehavior = await Behavior.findById(behavior._id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'firstName lastName');

    res.status(201).json(populatedBehavior);
  } catch (error) {
    console.error('Create behavior report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/behavior/:id
// @desc    Update behavior report
// @access  Private (Teacher/Admin)
router.put('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const behavior = await Behavior.findById(req.params.id);

    if (!behavior) {
      return res.status(404).json({ message: 'Behavior report not found' });
    }

    if (req.user.role !== 'admin' && behavior.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(behavior, req.body, { updatedAt: Date.now() });
    await behavior.save();

    const updatedBehavior = await Behavior.findById(behavior._id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'firstName lastName');

    res.json(updatedBehavior);
  } catch (error) {
    console.error('Update behavior report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/behavior/:id
// @desc    Delete behavior report
// @access  Private (Teacher/Admin)
router.delete('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const behavior = await Behavior.findById(req.params.id);

    if (!behavior) {
      return res.status(404).json({ message: 'Behavior report not found' });
    }

    if (req.user.role !== 'admin' && behavior.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await behavior.deleteOne();
    res.json({ message: 'Behavior report deleted successfully' });
  } catch (error) {
    console.error('Delete behavior report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

