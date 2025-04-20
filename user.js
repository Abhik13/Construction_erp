const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const { verifyToken, authorizeRoles } = require('./auth');

// Login route (POST)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE Username = ? AND PasswordHash = ?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    // Generate JWT token with user role
    const token = jwt.sign(
      { id: user.Userid, role: user.Role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.Role });
  });
});

// Example of admin-only route
router.get('/admin/dashboard', verifyToken, authorizeRoles('Admin'), (req, res) => {
  res.send('Admin dashboard data');
});

// Example of supervisor-only route
router.get('/supervisor/logs', verifyToken, authorizeRoles('Supervisor'), (req, res) => {
  res.send('Supervisor logs');
});

// Example of contractor-only route
router.get('/contractor/view', verifyToken, authorizeRoles('Contractor'), (req, res) => {
  res.send('Contractor view');
});

module.exports = router;
