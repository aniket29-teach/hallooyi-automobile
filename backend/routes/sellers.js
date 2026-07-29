const express = require('express');
const { pool } = require('../config/db');
const { auth, sellerOrAbove } = require('../middleware/auth');
const router = express.Router();

// Get seller dashboard
router.get('/dashboard', auth, sellerOrAbove, async (req, res) => {
  try {
    const seller_id = req.user.id;
    const [[listings]] = await pool.execute('SELECT COUNT(*) as count FROM cars WHERE seller_id = ?', [seller_id]);
    const [[sold]] = await pool.execute(`
      SELECT COUNT(*) as count FROM orders o
      JOIN cars c ON o.car_id = c.id WHERE c.seller_id = ? AND o.status = 'paid'
    `, [seller_id]);
    const [[earnings]] = await pool.execute(`
      SELECT COALESCE(SUM(o.amount), 0) as total FROM orders o
      JOIN cars c ON o.car_id = c.id WHERE c.seller_id = ? AND o.status = 'paid'
    `, [seller_id]);
    const [[pending]] = await pool.execute("SELECT COUNT(*) as count FROM cars WHERE seller_id = ? AND status = 'pending'", [seller_id]);

    res.json({ listings: listings.count, sold: sold.count, earnings: earnings.total, pending: pending.count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller listings
router.get('/my-listings', auth, sellerOrAbove, async (req, res) => {
  try {
    const [cars] = await pool.execute(`
      SELECT c.*, cat.name as category_name,
      (SELECT COUNT(*) FROM orders WHERE car_id = c.id) as order_count
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.seller_id = ?
      ORDER BY c.created_at DESC
    `, [req.user.id]);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller orders
router.get('/my-orders', auth, sellerOrAbove, async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT o.*, c.make, c.model, u.name as buyer_name, u.phone as buyer_phone
      FROM orders o
      JOIN cars c ON o.car_id = c.id
      JOIN users u ON o.buyer_id = u.id
      WHERE c.seller_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
