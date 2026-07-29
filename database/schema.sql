-- HALLOOYI AUTOMOBILE DATABASE SCHEMA
-- MySQL Database

CREATE DATABASE IF NOT EXISTS hallooyi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hallooyi_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(255),
  role ENUM('customer', 'seller', 'moderator', 'admin') DEFAULT 'customer',
  social_provider VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars Table
CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  location VARCHAR(100),
  car_condition ENUM('new', 'used', 'certified') DEFAULT 'used',
  description TEXT,
  category_id INT,
  seller_id INT NOT NULL,
  mileage INT,
  fuel_type ENUM('petrol', 'diesel', 'electric', 'hybrid') DEFAULT 'petrol',
  transmission ENUM('automatic', 'manual') DEFAULT 'automatic',
  color VARCHAR(30),
  status ENUM('pending', 'approved', 'rejected', 'sold') DEFAULT 'pending',
  featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Car Images Table
CREATE TABLE IF NOT EXISTS car_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  buyer_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50),
  shipping_address TEXT,
  status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  method VARCHAR(50),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist (user_id, car_id)
);

-- Comparisons Table
CREATE TABLE IF NOT EXISTS comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_ids JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('order', 'listing', 'message', 'price_drop', 'system') DEFAULT 'system',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
('SUV', 'Sport Utility Vehicles', 'suv'),
('Sedan', 'Comfortable family sedans', 'sedan'),
('Truck', 'Heavy duty trucks', 'truck'),
('Electric', 'Electric vehicles', 'electric'),
('Sports', 'Sports cars', 'sports'),
('Hatchback', 'Compact hatchbacks', 'hatchback'),
('Coupe', 'Two-door coupes', 'coupe'),
('Van', 'Passenger and cargo vans', 'van')
ON DUPLICATE KEY UPDATE name = name;

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin User', 'admin@hallooyi.com', '$2a$10$YourHashedPasswordHere', '+1234567890', 'admin')
ON DUPLICATE KEY UPDATE email = email;
