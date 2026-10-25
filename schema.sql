CREATE DATABASE IF NOT EXISTS ibraq_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ibraq_db;

-- Users table supporting member & admin roles
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('member', 'admin') DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with fragrance notes and images
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  top_notes VARCHAR(255),
  heart_notes VARCHAR(255),
  base_notes VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Key-Value Site Settings table for real-time site customization
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL
);

-- Seed Default Settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_title', 'IBRAQ | Ibrahim Al-Qurashi USA'),
('brand_subtitle', 'Haute Parfumerie & Royal Oriental Blends'),
('ticker_message', '✨ Complimentary Express Shipping across USA on orders over $200 | Receive 2 Royal Samples with Every Order'),
('hero_title', 'The Crown Jewel of Arabian Perfumery'),
('hero_subtitle', 'Immerse yourself in aged Cambodian Oud, Taif Rose, and Amber Intense.'),
('hero_image', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=80')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- Seed Default Admin User (Password: AdminSecret123!)
INSERT INTO users (name, email, password, role) VALUES
('Royal Admin', 'admin@ibraq.com', '$2a$10$9.0qV/l7pUvgjUqgH4D2f.b4vO8J2i6e3gY5T7C0jF8K3A2D1E5Gm', 'admin')
ON DUPLICATE KEY UPDATE role='admin';

-- Seed Initial Luxury Products
INSERT INTO products (title, category, price, description, top_notes, heart_notes, base_notes, image_url, is_featured) VALUES
('Oud Royal Black', 'Best Sellers', 280.00, 'A majestic accord of 30-year aged wild Cambodian Oud and leather.', 'Saffron, Bergamot', 'Cambodian Oud, Rose Absolute', 'Amber, Leather, Sandalwood', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80', TRUE),
('Velvet Rose & Taif', 'For Her', 210.00, 'Handpicked Taif Roses blended with Bulgarian Damask and white musk.', 'Taif Rose, Pink Pepper', 'Bulgarian Rose, Violet', 'White Musk, Vanilla Bean', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80', TRUE),
('Amber Imperial', 'The Fall Edit', 245.00, 'Warm golden amber paired with rich spicy cardamoms and honeyed vanilla.', 'Cardamom, Cinnamon', 'Golden Amber, Benzoin', 'Madagascar Vanilla, Cedar', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80', FALSE),
('Musk Al Qurashi', 'For Him', 195.00, 'A clean, captivating signature musk with metallic freshness and cedarwood.', 'Clary Sage, Bergamot', 'Royal White Musk', 'Virginia Cedar, Tonka Bean', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80', FALSE),
('The Sultan Coffret', 'Gifts', 450.00, 'A limited-edition wooden gift box featuring our top 3 oils and extraits.', 'Oud, Rose, Amber', 'Saffron, Frankincense', 'Pure White Musk', 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80', TRUE);
