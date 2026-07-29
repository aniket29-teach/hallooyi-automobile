const express = require('express');
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const [notifications] = await pool.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    await pool.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await pool.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const [[result]] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    );
    res.json({ count: result.count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
