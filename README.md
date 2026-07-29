# HALLOOYI AUTOMOBILE - Full Stack Application

## Complete Car Buying & Selling Platform

**Tech Stack:** React Vite + Node.js/Express + MySQL

---

## Project Structure

```
hallooyi-automobile/
├── backend/              # Node.js + Express API
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & Upload middleware
│   ├── routes/           # API routes
│   ├── uploads/cars/     # Car images storage
│   ├── .env.example      # Environment variables template
│   ├── package.json
│   └── server.js         # Entry point
├── frontend/             # React Vite App
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Auth context
│   │   ├── utils/        # API utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── database/
    ├── schema.sql        # MySQL database schema
    ├── initDb.js         # Database initializer
    └── seed.js           # Sample data
```

---

## Setup Instructions

### 1. Database Setup (MySQL)

```bash
cd database
npm install mysql2
node initDb.js    # Creates database and tables
node seed.js      # Inserts sample data
```

Or manually import `schema.sql` into MySQL Workbench / phpMyAdmin.

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev       # Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev       # Runs on http://localhost:5173
```

---

## Default Login Credentials

| Role      | Email                  | Password     |
|-----------|------------------------|--------------|
| Admin     | admin@hallooyi.com     | admin123     |
| Seller    | seller@hallooyi.com    | password123  |
| Customer  | customer@hallooyi.com  | password123  |
| Moderator | moderator@hallooyi.com | password123  |

---

## Features Implemented

### Customer Side
- Clean landing page with featured cars
- Advanced car search with filters (make, model, year, price, location, condition, category)
- User registration/login with email, phone
- Social login support
- Place orders with payment gateway
- Email & on-site notifications
- Car comparison tool (up to 4 cars)
- Wishlist / Favorites
- Reviews & Ratings
- Responsive design (mobile, tablet, desktop)

### Admin/Moderator Side
- Admin dashboard with analytics & stats
- Category management (CRUD)
- User management with role assignment
- Moderator management
- Listing approval/rejection system
- Order & payment tracking
- Analytics & reports

### Seller Side
- Seller dashboard with stats
- Add new car listings with image upload
- Manage own listings
- View orders for their cars
- Track earnings

---

## API Endpoints

| Endpoint               | Method | Description              |
|------------------------|--------|--------------------------|
| /api/auth/register     | POST   | User registration        |
| /api/auth/login        | POST   | User login               |
| /api/auth/me           | GET    | Get current user         |
| /api/cars              | GET    | Get all cars             |
| /api/cars/:id          | GET    | Get single car details   |
| /api/cars              | POST   | Create car listing       |
| /api/orders            | POST   | Place order              |
| /api/orders/my-orders  | GET    | Get user orders          |
| /api/payments/process  | POST   | Process payment          |
| /api/admin/dashboard   | GET    | Admin stats              |
| /api/admin/users       | GET    | Get all users            |
| /api/admin/categories  | GET/POST/PUT/DELETE | Category CRUD |
| /api/sellers/dashboard | GET    | Seller stats             |
| /api/compare/data      | POST   | Compare cars             |
| /api/reviews           | POST   | Add review               |

---

## Environment Variables (.env)

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hallooyi_db
JWT_SECRET=hallooyi_super_secret_key_2026
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

---

## License
MIT License - Hallooyi Automobile 2026
