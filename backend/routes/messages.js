const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   POST /api/messages
// @desc    Send message
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, studentId, subject, content, attachments } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'ReceiverID and content are required' });
    }

    // Verify receiver exists and is valid role
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Parents can message teachers, teachers can message parents
    if (req.user.role === 'parent' && receiver.role !== 'teacher') {
      return res.status(403).json({ message: 'Parents can only message teachers' });
    }
    if (req.user.role === 'teacher' && receiver.role !== 'parent') {
      return res.status(403).json({ message: 'Teachers can only message parents' });
    }

    const message = new Message({
      senderId: req.user._id,
      receiverId,
      studentId: studentId || null,
      subject: subject || '',
      content,
      attachments: attachments || []
    });

    await message.save();
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'firstName lastName email role')
      .populate('receiverId', 'firstName lastName email role')
      .populate('studentId', 'firstName lastName studentId');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get list of conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    })
      .populate('senderId', 'firstName lastName email role')
      .populate('receiverId', 'firstName lastName email role')
      .sort({ createdAt: -1 });

    // Group by conversation partner
    const conversations = {};
    messages.forEach(msg => {
      const partnerId = msg.senderId._id.toString() === req.user._id.toString()
        ? msg.receiverId._id.toString()
        : msg.senderId._id.toString();

      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partner: msg.senderId._id.toString() === req.user._id.toString()
            ? msg.receiverId
            : msg.senderId,
          lastMessage: msg,
          unreadCount: 0
        };
      }

      if (!msg.isRead && msg.receiverId._id.toString() === req.user._id.toString()) {
        conversations[partnerId].unreadCount++;
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages
// @desc    Get messages (conversations)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { conversationWith, studentId } = req.query;

    let query = {
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    };

    if (conversationWith) {
      query = {
        $or: [
          { senderId: req.user._id, receiverId: conversationWith },
          { senderId: conversationWith, receiverId: req.user._id }
        ]
      };
    }

    if (studentId) {
      query.studentId = studentId;
    }

    const messages = await Message.find(query)
      .populate('senderId', 'firstName lastName email role')
      .populate('receiverId', 'firstName lastName email role')
      .populate('studentId', 'firstName lastName studentId')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    message.isRead = true;
    message.readAt = Date.now();
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get unread message count
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

