# API Documentation

## Authentication APIs
- `POST /api/auth/register` - Create new member account.
- `POST /api/auth/login` - Authenticate member or admin user.

## Public APIs
- `GET /api/settings` - Retrieve dynamic site settings.
- `GET /api/products` - Retrieve products list (optional query: `?category=For+Him`).
- `GET /api/products/:id` - Retrieve single product detail.

## Member APIs (JWT Protected)
- `GET /api/member/lounge` - Access VIP member perks and discount codes.

## Admin APIs (Admin JWT Protected)
- `POST /api/admin/settings` - Save dynamic site customizations.
- `POST /api/admin/products` - Add new product (supports image file upload or URL).
- `POST /api/admin/products/bulk` - Bulk import products array.
- `DELETE /api/admin/products/:id` - Delete product by ID.
