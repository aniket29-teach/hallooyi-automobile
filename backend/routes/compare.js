const express = require('express');
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Save comparison
router.post('/', auth, async (req, res) => {
  try {
    const { car_ids } = req.body;
    if (!Array.isArray(car_ids) || car_ids.length < 2 || car_ids.length > 4) {
      return res.status(400).json({ message: 'Compare 2 to 4 cars' });
    }
    const [result] = await pool.execute(
      'INSERT INTO comparisons (user_id, car_ids) VALUES (?, ?)',
      [req.user.id, JSON.stringify(car_ids)]
    );
    res.status(201).json({ message: 'Comparison saved', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comparison data
router.post('/data', async (req, res) => {
  try {
    const { car_ids } = req.body;
    const placeholders = car_ids.map(() => '?').join(',');
    const [cars] = await pool.execute(`
      SELECT c.*, cat.name as category_name FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id IN (${placeholders})
    `, car_ids);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
