# IBRAQ (Ibrahim Al-Qurashi USA) - Full-Stack E-Commerce Storefront

A production-ready luxury oriental perfume storefront and customizer panel built using **Node.js**, **Express**, and **MySQL**.

## 🌟 Key Features
- **JWT & bcrypt Authentication**: Secure member registration/login and admin panel access.
- **Single Page Application (SPA)**: Home, Catalog, Product Details (PDP), Wishlist, VIP Member Lounge, and Cart.
- **VIP Royal Member Lounge**: Restricted perks and discount code access.
- **Interactive Shopping Cart**: Free shipping threshold progress bar ($200 goal).
- **Admin Customizer Panel (`/admin.html`)**: Dynamic site branding, hero images, product creation (file upload / URL), and bulk JSON imports.

## 🚀 Quick Start
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Database**:
   ```bash
   mysql -u root -p < schema.sql
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your MySQL credentials.
4. **Start Application**:
   ```bash
   npm start
   ```
5. **URLs**:
   - Storefront: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin.html` (Default: `admin@ibraq.com` / `AdminSecret123!`)
