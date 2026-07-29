const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hallooyi_db'
  });

  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Users
  await pool.execute(
    'INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
    [1, 'Admin User', 'admin@hallooyi.com', adminPassword, '+1234567890', 'admin']
  );
  await pool.execute(
    'INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
    [2, 'John Seller', 'seller@hallooyi.com', hashedPassword, '+1234567891', 'seller']
  );
  await pool.execute(
    'INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
    [3, 'Jane Customer', 'customer@hallooyi.com', hashedPassword, '+1234567892', 'customer']
  );
  await pool.execute(
    'INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
    [4, 'Moderator', 'moderator@hallooyi.com', hashedPassword, '+1234567893', 'moderator']
  );

  // Sample Cars
  const cars = [
    [1, 'Toyota', 'Camry', 2023, 28500, 'Lagos', 'new', 'Brand new Toyota Camry with full options', 2, 1, 0, 'petrol', 'automatic', 'White', 'approved', true],
    [2, 'Honda', 'Accord', 2022, 24500, 'Abuja', 'used', 'Well maintained Honda Accord', 2, 2, 15000, 'petrol', 'automatic', 'Black', 'approved', true],
    [3, 'Tesla', 'Model 3', 2023, 42000, 'Lagos', 'new', 'Electric vehicle with autopilot', 4, 1, 0, 'electric', 'automatic', 'Red', 'approved', true],
    [4, 'Ford', 'F-150', 2021, 35000, 'Kano', 'used', 'Heavy duty truck', 3, 2, 25000, 'diesel', 'automatic', 'Blue', 'approved', false],
    [5, 'BMW', 'X5', 2023, 65000, 'Lagos', 'new', 'Luxury SUV', 1, 1, 0, 'petrol', 'automatic', 'Grey', 'pending', false],
    [6, 'Mercedes', 'C-Class', 2022, 48000, 'Abuja', 'certified', 'Certified pre-owned', 2, 2, 8000, 'petrol', 'automatic', 'Silver', 'approved', true],
    [7, 'Lexus', 'RX 350', 2023, 52000, 'Lagos', 'new', 'Premium SUV', 1, 1, 0, 'petrol', 'automatic', 'Black', 'approved', true],
    [8, 'Hyundai', 'Tucson', 2022, 28000, 'Port Harcourt', 'used', 'Compact SUV', 1, 2, 12000, 'petrol', 'automatic', 'White', 'approved', false]
  ];

  for (const car of cars) {
    await pool.execute(
      `INSERT IGNORE INTO cars (id, make, model, year, price, location, car_condition, description, category_id, seller_id, mileage, fuel_type, transmission, color, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      car
    );
  }

  console.log('Seed data inserted successfully!');
  await pool.end();
}

seed().catch(console.error);
