const express = require('express');
const { pool } = require('../config/db');
const { auth, moderatorOrAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get all cars with filters
router.get('/', async (req, res) => {
  try {
    const { make, model, year, minPrice, maxPrice, location, condition, category, search, status = 'approved' } = req.query;
    let sql = `
      SELECT c.*, cat.name as category_name, u.name as seller_name,
      (SELECT AVG(rating) FROM reviews WHERE car_id = c.id) as avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE car_id = c.id) as review_count
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.seller_id = u.id
      WHERE c.status = ?
    `;
    const params = [status];

    if (make) { sql += ' AND c.make LIKE ?'; params.push(`%${make}%`); }
    if (model) { sql += ' AND c.model LIKE ?'; params.push(`%${model}%`); }
    if (year) { sql += ' AND c.year = ?'; params.push(year); }
    if (minPrice) { sql += ' AND c.price >= ?'; params.push(minPrice); }
    if (maxPrice) { sql += ' AND c.price <= ?'; params.push(maxPrice); }
    if (location) { sql += ' AND c.location LIKE ?'; params.push(`%${location}%`); }
    if (condition) { sql += ' AND c.car_condition = ?'; params.push(condition); }
    if (category) { sql += ' AND cat.name = ?'; params.push(category); }
    if (search) { sql += ' AND (c.make LIKE ? OR c.model LIKE ? OR c.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    sql += ' ORDER BY c.created_at DESC';

    const [cars] = await pool.execute(sql, params);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single car
router.get('/:id', async (req, res) => {
  try {
    const [cars] = await pool.execute(`
      SELECT c.*, cat.name as category_name, u.name as seller_name, u.phone as seller_phone
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.seller_id = u.id
      WHERE c.id = ?
    `, [req.params.id]);

    if (cars.length === 0) return res.status(404).json({ message: 'Car not found' });

    const [images] = await pool.execute('SELECT * FROM car_images WHERE car_id = ?', [req.params.id]);
    const [reviews] = await pool.execute(`
      SELECT r.*, u.name as reviewer_name FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.car_id = ? ORDER BY r.created_at DESC
    `, [req.params.id]);

    res.json({ ...cars[0], images, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create car listing (seller/admin)
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { make, model, year, price, location, car_condition, description, category_id, mileage, fuel_type, transmission, color } = req.body;
    const seller_id = req.user.id;

    const [result] = await pool.execute(
      `INSERT INTO cars (make, model, year, price, location, car_condition, description, category_id, seller_id, mileage, fuel_type, transmission, color, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [make, model, year, price, location, car_condition, description, category_id, seller_id, mileage, fuel_type, transmission, color]
    );

    const carId = result.insertId;
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.execute('INSERT INTO car_images (car_id, image_url) VALUES (?, ?)', 
          [carId, `/uploads/cars/${file.filename}`]);
      }
    }

    res.status(201).json({ message: 'Car listing created and pending approval', carId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update car
router.put('/:id', auth, async (req, res) => {
  try {
    const { make, model, year, price, location, car_condition, description, status } = req.body;
    await pool.execute(
      'UPDATE cars SET make=?, model=?, year=?, price=?, location=?, car_condition=?, description=?, status=? WHERE id=?',
      [make, model, year, price, location, car_condition, description, status, req.params.id]
    );
    res.json({ message: 'Car updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete car
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM cars WHERE id = ?', [req.params.id]);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Featured cars
router.get('/featured/list', async (req, res) => {
  try {
    const [cars] = await pool.execute(`
      SELECT c.*, cat.name as category_name FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.status = 'approved' AND c.featured = 1
      ORDER BY c.created_at DESC LIMIT 8
    `);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
