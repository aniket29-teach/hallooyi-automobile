const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hallooyi_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Database Connected Successfully');
    connection.release();
  } catch (error) {
    console.error('Database Connection Failed:', error.message);
  }
};

module.exports = { pool, testConnection };