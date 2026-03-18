# Halleyx Backend — Node.js + Express + MySQL

## Stack
- Node.js + Express 4
- MySQL 8 (via mysql2/promise)
- JWT (access + refresh token rotation)
- bcryptjs (password hashing, 12 rounds)
- express-validator (input validation)
- express-rate-limit (brute-force protection)

---

## Setup

### 1. Install dependencies
```bash
cd halleyx-backend
npm install
```

### 2. Create MySQL database
```sql
CREATE DATABASE halleyx_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
```

### 4. Start server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```
Tables are **auto-created** on first start. Then optionally seed:
```bash
mysql -u root -p halleyx_db < seed.sql
```

Server runs at: `http://localhost:5000`

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

---

## Auth Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/refresh` | ❌ | Refresh access token |
| POST | `/api/auth/logout` | ❌ | Logout (revoke refresh token) |
| POST | `/api/auth/logout-all` | ✅ | Logout all devices |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update name |
| PUT | `/api/auth/change-password` | ✅ | Change password |

### Register
```json
POST /api/auth/register
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@example.com",
  "password": "Secret123"
}
```
**Password rules:** min 8 chars, 1 uppercase, 1 number

### Login
```json
POST /api/auth/login
{
  "email": "alice@example.com",
  "password": "Secret123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "firstName": "Alice", ... },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Using the Access Token
Add to every protected request:
```
Authorization: Bearer <accessToken>
```

### Refresh Token
```json
POST /api/auth/refresh
{ "refreshToken": "eyJ..." }
```
Returns new `accessToken` + `refreshToken` (rotation).

### Change Password
```json
PUT /api/auth/change-password
{ "currentPassword": "Secret123", "newPassword": "NewPass456" }
```

---

## Order Endpoints (all require Auth)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/orders` | List all orders |
| GET | `/api/orders?dateRange=Last 7 Days` | Filtered orders |
| GET | `/api/orders/stats` | Aggregated stats |
| GET | `/api/orders/:id` | Single order |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |

### dateRange query values
`All time` | `Today` | `Last 7 Days` | `Last 30 Days` | `Last 90 Days`

### Create / Update Order body
```json
{
  "firstName": "Alice", "lastName": "Johnson",
  "email": "alice@example.com", "phone": "555-0100",
  "street": "123 Main St", "city": "New York", "state": "NY",
  "postal": "10001", "country": "United States",
  "product": "Fiber Internet 1 Gbps",
  "quantity": 2, "unitPrice": 89.99,
  "status": "Pending",
  "createdBy": "Mr. Michael Harris"
}
```
`totalAmount` is computed server-side.

---

## Dashboard Endpoints (require Auth)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/dashboard` | Load saved layout |
| POST | `/api/dashboard` | Save layout |
| DELETE | `/api/dashboard` | Reset dashboard |

### Save Layout
```json
POST /api/dashboard
{ "layout": [ { "id": "...", "type": "Bar Chart", ... } ] }
```

---

## Security Features
- JWT access tokens (7d expiry by default)
- Refresh token rotation (30d, stored in DB)
- bcrypt password hashing (12 rounds)
- Rate limiting: 10 login attempts / 15 min per IP
- Register limit: 5/hour per IP
- All passwords are never returned in responses

---

## Project Structure
```
src/
  server.js               # Entry point, Express app setup
  config/
    db.js                 # MySQL connection pool
    initDB.js             # Auto-create tables on startup
  middleware/
    auth.js               # JWT authenticate + authorize
    errorHandler.js       # Validation handler + global error handler
  models/
    UserModel.js          # User DB queries
    OrderModel.js         # Order DB queries
    DashboardModel.js     # Dashboard layout storage
  controllers/
    authController.js     # Register, login, refresh, me, etc.
    orderController.js    # CRUD operations
    dashboardController.js# Save/load layout
  routes/
    authRoutes.js         # /api/auth/*
    orderRoutes.js        # /api/orders/*
    dashboardRoutes.js    # /api/dashboard/*
```

---

## Connecting to Frontend

In your React frontend's `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Store `accessToken` in memory (or localStorage) and `refreshToken` in an httpOnly cookie or localStorage. Send `Authorization: Bearer <token>` on every API call.
