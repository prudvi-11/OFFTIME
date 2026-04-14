const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../database');

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, message, status, created_at FROM notifications WHERE user_id = $1 ORDER BY id DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('[Notifications GET] Error:', err.message);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
});

// @route   POST /api/notifications/mark-read
// @desc    Mark all user notifications as read
router.post('/mark-read', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET status = $1 WHERE user_id = $2',
      ['read', req.user.id]
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('[Notifications POST] Error:', err.message);
    res.status(500).json({ message: 'Server error while marking notifications as read' });
  }
});

module.exports = router;