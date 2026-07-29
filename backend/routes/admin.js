const express = require('express');
const { pool } = require('../config/db');
const { auth, adminOnly, moderatorOrAdmin } = require('../middleware/auth');
const router = express.Router();

// Dashboard stats
router.get('/dashboard', auth, moderatorOrAdmin, async (req, res) => {
  try {
    const [[users]] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [[cars]] = await pool.execute('SELECT COUNT(*) as count FROM cars');
    const [[orders]] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const [[pending]] = await pool.execute("SELECT COUNT(*) as count FROM cars WHERE status = 'pending'");
    const [[revenue]] = await pool.execute("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'");
    const [[todayOrders]] = await pool.execute("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()");

    res.json({
      stats: { users: users.count, cars: cars.count, orders: orders.count, pending: pending.count, revenue: revenue.total, todayOrders: todayOrders.count }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Categories CRUD
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/categories', auth, moderatorOrAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await pool.execute('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ id: result.insertId, name, description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/categories/:id', auth, moderatorOrAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    await pool.execute('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/categories/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pending listings
router.get('/pending-listings', auth, moderatorOrAdmin, async (req, res) => {
  try {
    const [cars] = await pool.execute(`
      SELECT c.*, u.name as seller_name, cat.name as category_name
      FROM cars c
      JOIN users u ON c.seller_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.status = 'pending'
      ORDER BY c.created_at DESC
    `);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject listing
router.put('/listings/:id/approve', auth, moderatorOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.execute('UPDATE cars SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Listing ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analytics
router.get('/analytics', auth, moderatorOrAdmin, async (req, res) => {
  try {
    const [monthlySales] = await pool.execute(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as orders, SUM(amount) as revenue
      FROM orders WHERE status = 'paid' GROUP BY month ORDER BY month DESC LIMIT 12
    `);
    const [topCars] = await pool.execute(`
      SELECT c.make, c.model, COUNT(o.id) as order_count
      FROM cars c JOIN orders o ON c.id = o.car_id
      GROUP BY c.id ORDER BY order_count DESC LIMIT 5
    `);
    const [traffic] = await pool.execute(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as views
      FROM cars GROUP BY date ORDER BY date DESC LIMIT 30
    `);
    res.json({ monthlySales, topCars, traffic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
