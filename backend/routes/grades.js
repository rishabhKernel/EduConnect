const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Grade = require('../models/Grade');
const Student = require('../models/Student');

// @route   GET /api/grades
// @desc    Get grades (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    const { studentId, subject, gradeType, startDate, endDate } = req.query;

    // Parents can only see their children's grades
    if (req.user.role === 'parent') {
      const students = await Student.find({ _id: { $in: req.user.associatedIds } });
      const studentIds = students.map(s => s._id);
      query.studentId = { $in: studentIds };
    }
    // Teachers can see grades they created
    else if (req.user.role === 'teacher') {
      query.teacherId = req.user._id;
    }

    if (studentId) query.studentId = studentId;
    if (subject) query.subject = subject;
    if (gradeType) query.gradeType = gradeType;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const grades = await Grade.find(query)
      .populate('studentId', 'firstName lastName studentId grade')
      .populate('teacherId', 'firstName lastName')
      .populate('assignmentId', 'title')
      .sort({ date: -1 });

    res.json(grades);
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/grades/:id
// @desc    Get single grade
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'firstName lastName');

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Check access permissions
    if (req.user.role === 'parent') {
      const hasAccess = req.user.associatedIds.includes(grade.studentId._id);
      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'teacher' && grade.teacherId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(grade);
  } catch (error) {
    console.error('Get grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/grades
// @desc    Create new grade
// @access  Private (Teacher/Admin)
router.post('/', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { studentId, subject, grade, maxGrade, gradeType, comments, assignmentId, date } = req.body;

    const newGrade = new Grade({
      studentId,
      teacherId: req.user._id,
      subject,
      grade,
      maxGrade: maxGrade || 100,
      gradeType: gradeType || 'assignment',
      comments,
      assignmentId,
      date: date || Date.now()
    });

    await newGrade.save();
    const populatedGrade = await Grade.findById(newGrade._id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'firstName lastName');

    res.status(201).json(populatedGrade);
  } catch (error) {
    console.error('Create grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/grades/:id
// @desc    Update grade
// @access  Private (Teacher/Admin)
router.put('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Only the teacher who created it or admin can update
    if (req.user.role !== 'admin' && grade.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(grade, req.body, { updatedAt: Date.now() });
    await grade.save();

    const updatedGrade = await Grade.findById(grade._id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'firstName lastName');

    res.json(updatedGrade);
  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/grades/:id
// @desc    Delete grade
// @access  Private (Teacher/Admin)
router.delete('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    if (req.user.role !== 'admin' && grade.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await grade.deleteOne();
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

