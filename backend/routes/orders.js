const express = require('express');
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { car_id, amount, payment_method, shipping_address } = req.body;
    const buyer_id = req.user.id;

    const [result] = await pool.execute(
      'INSERT INTO orders (car_id, buyer_id, amount, payment_method, shipping_address, status) VALUES (?, ?, ?, ?, ?, ?)',
      [car_id, buyer_id, amount, payment_method, shipping_address, 'pending']
    );

    // Create notification
    await pool.execute(
      'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
      [buyer_id, 'order', `Order #${result.insertId} placed successfully. Pending confirmation.`]
    );

    res.status(201).json({ message: 'Order placed successfully', orderId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT o.*, c.make, c.model, c.year, c.price, ci.image_url as car_image
      FROM orders o
      JOIN cars c ON o.car_id = c.id
      LEFT JOIN car_images ci ON c.id = ci.car_id
      WHERE o.buyer_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const [orders] = await pool.execute(`
      SELECT o.*, c.make, c.model, u.name as buyer_name, s.name as seller_name
      FROM orders o
      JOIN cars c ON o.car_id = c.id
      JOIN users u ON o.buyer_id = u.id
      JOIN users s ON c.seller_id = s.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    const [orders] = await pool.execute('SELECT buyer_id FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length > 0) {
      await pool.execute(
        'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
        [orders[0].buyer_id, 'order', `Order #${req.params.id} status updated to ${status}`]
      );
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
