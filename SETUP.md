# BServ - Photocopier Machine Business Platform

A full-stack web application for browsing, buying, and renting photocopier machines.

## Tech Stack
- **Frontend:** React.js, Framer Motion, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL

---

## Setup Instructions

### 1. PostgreSQL Database Setup

Make sure PostgreSQL is installed and running. Create the database:

```sql
CREATE DATABASE bserv_photocopy;
```

### 2. Backend Setup

```bash
cd backend

# Update .env file with your PostgreSQL password
# Edit backend/.env -> change DB_PASSWORD=your_password_here to your actual password

# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start the backend server (runs on port 5000)
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already installed)
npm install

# Start the React dev server (runs on port 3000)
npm start
```

### 4. Open the App

Visit `http://localhost:3000` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/machines | Get all machines (with filters) |
| GET | /api/machines/featured | Get featured machines |
| GET | /api/machines/brands | Get all brands |
| GET | /api/machines/:slug | Get machine details |
| GET | /api/categories | Get all categories |
| POST | /api/inquiries | Submit an inquiry |
| POST | /api/orders | Place an order (buy/rent) |
| GET | /api/orders/:orderNumber | Track order |
| POST | /api/contact | Send contact message |
| POST | /api/reviews | Submit a review |

## Query Parameters for /api/machines

- `search` - Search by name, brand, description
- `category` - Filter by category slug
- `brand` - Filter by brand name
- `condition` - Filter by condition (new/refurbished)
- `min_price` / `max_price` - Price range
- `sort` - Sort by: price_low, price_high, rating, name
- `page` / `limit` - Pagination
