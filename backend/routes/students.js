const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const User = require('../models/User');

// @route   GET /api/students
// @desc    Get all students (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = { isActive: true };

    // Parents can only see their own children
    if (req.user.role === 'parent') {
      query._id = { $in: req.user.associatedIds };
    }
    // Teachers can see all students (for attendance, grading, etc.)
    // If you want to restrict to only their students, use: query.teacherIds = req.user._id;
    // else if (req.user.role === 'teacher') {
    //   query.teacherIds = req.user._id;
    // }

    const students = await Student.find(query)
      .populate('parentIds', 'firstName lastName email phone')
      .populate('teacherIds', 'firstName lastName email')
      .sort({ lastName: 1, firstName: 1 });

    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('parentIds', 'firstName lastName email phone')
      .populate('teacherIds', 'firstName lastName email');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check access permissions
    if (req.user.role === 'parent' && !req.user.associatedIds.includes(student._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'teacher' && !student.teacherIds.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/students
// @desc    Create new student
// @access  Private (Admin/Teacher)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { firstName, lastName, studentId, dateOfBirth, grade, section, parentIds, subjects } = req.body;

    const student = new Student({
      firstName,
      lastName,
      studentId,
      dateOfBirth,
      grade,
      section,
      parentIds: parentIds || [],
      subjects: subjects || []
    });

    await student.save();

    // Update parent users with student association
    if (parentIds && parentIds.length > 0) {
      await User.updateMany(
        { _id: { $in: parentIds } },
        { $addToSet: { associatedIds: student._id } }
      );
    }

    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin/Teacher)
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

