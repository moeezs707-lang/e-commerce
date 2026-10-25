const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure Upload Directory Exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* ==========================================================================
   AUTH MIDDLEWARES
   ========================================================================== */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Malformed token.' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
}

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Royal Admin privilege required.' });
    }
  });
}

/* ==========================================================================
   PUBLIC ROUTES
   ========================================================================== */

// Fetch Dynamic Site Settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    rows.forEach(row => { settings[row.setting_key] = row.setting_value; });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch All Products (with Optional Category Filter)
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products ORDER BY id DESC';
    let params = [];

    if (category && category !== 'All') {
      query = 'SELECT * FROM products WHERE category = ? ORDER BY id DESC';
      params = [category];
    }

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Fragrance not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   AUTHENTICATION ROUTES
   ========================================================================== */

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already registered.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "member")',
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId, name, email, role: 'member' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.insertId, name, email, role: 'member' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ error: 'Invalid email or password.' });

    const user = users[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   MEMBER LOUNGE (PROTECTED)
   ========================================================================== */

app.get('/api/member/lounge', verifyToken, (req, res) => {
  res.json({
    welcomeMessage: `Greetings, Royal Member ${req.user.name}`,
    perks: [
      'Private Masterclass Booking with Senior Perfumers',
      'Complimentary 10ml Extrait de Parfum on Birthday',
      'First Access to Limited Harvest Aged Oud Drops'
    ],
    exclusivePromoCode: 'ROYAL-IBRAQ-VIP25',
    consultationStatus: '1 Complimentary Private Consultation Available'
  });
});

/* ==========================================================================
   ADMIN ROUTES (PROTECTED)
   ========================================================================== */

// Update Site Customizations
app.post('/api/admin/settings', verifyAdmin, async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    res.json({ message: 'Storefront customization updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Product Creation (supports upload or external URL)
app.post('/api/admin/products', verifyAdmin, upload.single('image_file'), async (req, res) => {
  try {
    const { title, category, price, description, top_notes, heart_notes, base_notes, image_url, is_featured } = req.body;
    
    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) return res.status(400).json({ error: 'An image file or external URL is required.' });

    const [result] = await db.query(
      `INSERT INTO products (title, category, price, description, top_notes, heart_notes, base_notes, image_url, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, category, price, description, top_notes, heart_notes, base_notes, finalImageUrl, is_featured === 'true' || is_featured === true]
    );

    res.json({ message: 'Product created successfully', productId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk Product Import JSON
app.post('/api/admin/products/bulk', verifyAdmin, async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid products array.' });
    }

    let inserted = 0;
    for (const p of products) {
      await db.query(
        `INSERT INTO products (title, category, price, description, top_notes, heart_notes, base_notes, image_url, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.title, p.category || 'Best Sellers', p.price, p.description, p.top_notes, p.heart_notes, p.base_notes, p.image_url, p.is_featured || false]
      );
      inserted++;
    }

    res.json({ message: `Successfully imported ${inserted} products.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
app.delete('/api/admin/products/:id', verifyAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✨ IBRAQ Luxury Server running at http://localhost:${PORT}`);
});
