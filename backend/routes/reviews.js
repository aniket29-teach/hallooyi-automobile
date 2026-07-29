const express = require('express');
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Add review
router.post('/', auth, async (req, res) => {
  try {
    const { car_id, rating, comment } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO reviews (car_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [car_id, req.user.id, rating, comment]
    );
    res.status(201).json({ message: 'Review added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get car reviews
router.get('/car/:id', async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT r.*, u.name as reviewer_name FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.car_id = ? ORDER BY r.created_at DESC
    `, [req.params.id]);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
