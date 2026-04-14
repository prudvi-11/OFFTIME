const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../database');

// Helper to notify user via Socket.io
async function notifyUser(req, userId, message) {
  try {
    // Save to DB
    const { rows } = await db.query(
      'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *',
      [userId, message]
    );

    // Emit real-time event if connected
    const socketId = req.userSockets.get(userId);
    if (socketId) {
      req.io.to(socketId).emit('notification', rows[0]);
    }
  } catch (err) {
    console.error('Notification error:', err);
  }
}

// @route   POST /api/leave
// @desc    Submit a leave request
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'teacher')
    return res.status(403).json({ message: 'Only teachers can apply' });

  const { admin_id, leave_type, start_date, end_date, total_days, reason } = req.body;

  try {
    // Validate Admin ID
    const adminCheck = await db.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2',
      [admin_id, 'admin']
    );
    if (adminCheck.rows.length === 0)
      return res.status(400).json({ message: 'Invalid Admin ID' });

    const result = await db.query(
      `INSERT INTO leaves 
      (teacher_id, teacher_name, admin_id, leave_type, start_date, end_date, total_days, reason, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending') RETURNING *`,
      [req.user.id, req.user.name, admin_id, leave_type, start_date, end_date, total_days, reason]
    );

    // Notify admin
    await notifyUser(
      req,
      parseInt(admin_id),
      `New leave request from ${req.user.name} (${leave_type})`
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/leave
// @desc    Get leaves based on role
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = '';
    let params = [];

    if (req.user.role === 'teacher') {
      query =
        'SELECT l.*, u.name as admin_name FROM leaves l LEFT JOIN users u ON l.admin_id = u.id WHERE l.teacher_id = $1 ORDER BY l.id DESC';
      params = [req.user.id];
    } else {
      query = 'SELECT * FROM leaves WHERE admin_id = $1 ORDER BY id DESC';
      params = [req.user.id];
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/leave/:id/approve
// @desc    Approve leave
router.post('/:id/approve', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Only admins can approve' });
  const { comment } = req.body;

  try {
    const leaveCheck = await db.query(
      'SELECT * FROM leaves WHERE id = $1 AND admin_id = $2',
      [req.params.id, req.user.id]
    );
    if (leaveCheck.rows.length === 0)
      return res
        .status(404)
        .json({ message: 'Leave request not found or not assigned to you' });
    if (leaveCheck.rows[0].status === 'Withdrawn')
      return res.status(400).json({ message: 'Cannot approve withdrawn request' });

    const result = await db.query(
      'UPDATE leaves SET status = $1, approved_by = $2, comment = $3 WHERE id = $4 RETURNING *',
      ['Approved', req.user.id, comment || null, req.params.id]
    );

    // Notify teacher (approve)
    await notifyUser(
      req,
      result.rows[0].teacher_id,
      `Your ${result.rows[0].leave_type} leave request has been Approved.`
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/leave/:id/reject
// @desc    Reject leave
router.post('/:id/reject', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can reject' });
  }

  const { comment } = req.body;

  try {
    const leaveCheck = await db.query(
      'SELECT * FROM leaves WHERE id = $1 AND admin_id = $2',
      [req.params.id, req.user.id]
    );

    if (leaveCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leaveCheck.rows[0].status === 'Withdrawn') {
      return res.status(400).json({ message: 'Cannot reject withdrawn request' });
    }

    if (leaveCheck.rows[0].status !== 'Pending') {
      return res.status(400).json({ message: 'Action already taken on this request' });
    }

    const result = await db.query(
      'UPDATE leaves SET status = $1, approved_by = $2, comment = $3 WHERE id = $4 RETURNING *',
      ['Rejected', req.user.id, comment || null, req.params.id]
    );

    // Notify teacher
    await notifyUser(
      req,
      result.rows[0].teacher_id,
      `Your ${result.rows[0].leave_type} leave request has been Rejected.`
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/leave/:id/withdraw
// @desc    Withdraw leave
router.post('/:id/withdraw', authMiddleware, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can withdraw' });
  }

  try {
    const leaveCheck = await db.query(
      'SELECT * FROM leaves WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );

    if (leaveCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leaveCheck.rows[0].status !== 'Pending') {
      return res.status(400).json({ message: 'Can only withdraw pending requests' });
    }

    const result = await db.query(
      'UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *',
      ['Withdrawn', req.params.id]
    );

    // Notify admin
    await notifyUser(
      req,
      result.rows[0].admin_id,
      `${req.user.name} has withdrawn their ${result.rows[0].leave_type} leave request.`
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/leave/teacher/:id
// @desc    Get all leaves for a specific teacher (Admin only)
router.get('/teacher/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can view specific teacher stats' });
  }

  try {
    // Only return leaves directed to this admin, OR all leaves for the teacher? 
    // The design is an overarching view, so let's show all leaves for that teacher.
    const { rows } = await db.query(
      'SELECT l.*, u.name as admin_name FROM leaves l LEFT JOIN users u ON l.admin_id = u.id WHERE l.teacher_id = $1 ORDER BY l.id DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch specific teacher leaves error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;