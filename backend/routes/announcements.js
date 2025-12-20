const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Announcement = require('../models/Announcement');
const Student = require('../models/Student');

// @route   GET /api/announcements
// @desc    Get announcements (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = { isActive: true };
    const { priority, targetAudience } = req.query;

    // Parents see announcements for their children or all
    if (req.user.role === 'parent') {
      const students = await Student.find({ _id: { $in: req.user.associatedIds } });
      const studentIds = students.map(s => s._id);

      query.$or = [
        { targetAudience: 'all' },
        { targetAudience: 'parents' },
        { targetStudentIds: { $in: studentIds } }
      ];
    }
    // Teachers see all announcements
    else if (req.user.role === 'teacher') {
      query.$or = [
        { targetAudience: 'all' },
        { targetAudience: 'teachers' }
      ];
    }

    if (priority) query.priority = priority;
    if (targetAudience) query.targetAudience = targetAudience;

    // Filter expired announcements
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gte: new Date() } }
    ];

    const announcements = await Announcement.find(query)
      .populate('authorId', 'firstName lastName email role')
      .populate('targetStudentIds', 'firstName lastName studentId')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/announcements/:id
// @desc    Get single announcement
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('authorId', 'firstName lastName email role')
      .populate('targetStudentIds', 'firstName lastName studentId');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/announcements
// @desc    Create announcement
// @access  Private (Teacher/Admin)
router.post('/', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, content, targetAudience, targetStudentIds, priority, attachments, expiresAt } = req.body;

    const announcement = new Announcement({
      title,
      content,
      authorId: req.user._id,
      targetAudience: targetAudience || 'all',
      targetStudentIds: targetStudentIds || [],
      priority: priority || 'medium',
      attachments: attachments || [],
      expiresAt
    });

    await announcement.save();
    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('authorId', 'firstName lastName email role')
      .populate('targetStudentIds', 'firstName lastName studentId');

    res.status(201).json(populatedAnnouncement);
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private (Teacher/Admin)
router.put('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (req.user.role !== 'admin' && announcement.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(announcement, req.body, { updatedAt: Date.now() });
    await announcement.save();

    const updatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('authorId', 'firstName lastName email role')
      .populate('targetStudentIds', 'firstName lastName studentId');

    res.json(updatedAnnouncement);
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (Teacher/Admin)
router.delete('/:id', auth, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (req.user.role !== 'admin' && announcement.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

