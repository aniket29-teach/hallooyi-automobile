const express = require('express');
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Process payment (mock)
router.post('/process', auth, async (req, res) => {
  try {
    const { order_id, amount, method, card_details } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO payments (order_id, amount, method, status, transaction_id) VALUES (?, ?, ?, ?, ?)',
      [order_id, amount, method, 'completed', `TXN${Date.now()}`]
    );

    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', ['paid', order_id]);

    res.json({ message: 'Payment processed successfully', paymentId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const [payments] = await pool.execute(`
      SELECT p.*, o.car_id, c.make, c.model
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      JOIN cars c ON o.car_id = c.id
      WHERE o.buyer_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id]);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
