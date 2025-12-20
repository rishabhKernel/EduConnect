const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');

// @route   GET /api/assignments
// @desc    Get assignments (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = { status: { $ne: 'draft' } };
    const { studentId, subject, status } = req.query;

    // Parents can see assignments for their children
    if (req.user.role === 'parent') {
      const students = await Student.find({ _id: { $in: req.user.associatedIds } });
      const studentIds = students.map(s => s._id);
      query.studentIds = { $in: studentIds };
    }
    // Teachers can see their own assignments
    else if (req.user.role === 'teacher') {
      query.teacherId = req.user._id;
    }

    if (studentId) query.studentIds = studentId;
    if (subject) query.subject = subject;
    if (status) query.status = status;

    const assignments = await Assignment.find(query)
      .populate('teacherId', 'firstName lastName')
      .populate('studentIds', 'firstName lastName studentId')
      .sort({ dueDate: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get single assignment
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacherId', 'firstName lastName email')
      .populate('studentIds', 'firstName lastName studentId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Private (Teacher/Admin)
router.post('/', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, subject, studentIds, dueDate, maxGrade, attachments, status } = req.body;

    const assignment = new Assignment({
      title,
      description,
      subject,
      teacherId: req.user._id,
      studentIds: studentIds || [],
      dueDate,
      maxGrade: maxGrade || 100,
      attachments: attachments || [],
      status: status || 'published'
    });

    await assignment.save();
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('teacherId', 'firstName lastName')
      .populate('studentIds', 'firstName lastName studentId');

    res.status(201).json(populatedAssignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Private (Teacher/Admin)
router.put('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (req.user.role !== 'admin' && assignment.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(assignment, req.body, { updatedAt: Date.now() });
    await assignment.save();

    const updatedAssignment = await Assignment.findById(assignment._id)
      .populate('teacherId', 'firstName lastName')
      .populate('studentIds', 'firstName lastName studentId');

    res.json(updatedAssignment);
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private (Teacher/Admin)
router.delete('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (req.user.role !== 'admin' && assignment.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

