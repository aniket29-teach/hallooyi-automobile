const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.execute('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.id]);

    if (users.length === 0) return res.status(401).json({ message: 'Token is not valid' });

    req.user = users[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const moderatorOrAdmin = (req, res, next) => {
  if (!['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Moderator or Admin access required' });
  }
  next();
};

const sellerOrAbove = (req, res, next) => {
  if (!['admin', 'moderator', 'seller'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Seller access required' });
  }
  next();
};

module.exports = { auth, adminOnly, moderatorOrAdmin, sellerOrAbove };
