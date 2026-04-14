const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Please provide Name and password' });
    }

    // Fetch user by name
    const { rows } = await db.query('SELECT * FROM users WHERE name = $1', [name]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '10h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, role, password } = req.body;

    if (!name || !role || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (role !== 'teacher' && role !== 'admin') {
       return res.status(400).json({ message: 'Invalid role' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const { rows } = await db.query(
      'INSERT INTO users (name, role, password) VALUES ($1, $2, $3) RETURNING id, name, role',
      [name, role, hashedPassword]
    );

    const user = rows[0];

    // Create JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '10h' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, role FROM users WHERE id = $1',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Fetch user error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/admins
// @desc    Get all admins
router.get('/admins', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name FROM users WHERE role = $1',
      ['admin']
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch admins error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/teachers
// @desc    Get all teachers
router.get('/teachers', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const { rows } = await db.query(
      'SELECT id, name FROM users WHERE role = $1 ORDER BY name ASC',
      ['teacher']
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch teachers error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;