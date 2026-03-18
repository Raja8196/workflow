# Halleyx Dashboard Builder — Full Stack

A complete full-stack application with a React frontend and Node.js + Express + MySQL backend.

```
halleyx-fullstack/
├── frontend/   → React 18 + Recharts (Dashboard Builder)
└── backend/    → Node.js + Express + MySQL (REST API + Auth)
```

---

## Quick Start

### Step 1 — MySQL Setup
```bash
mysql -u root -p
CREATE DATABASE halleyx_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 2 — Backend
```bash
cd backend
npm install
cp .env.example .env
# Open .env and set your DB_PASSWORD (and DB_USER if not root)
npm run dev
# Runs on http://localhost:5000
```
Tables are auto-created on first boot. Optionally load sample data:
```bash
mysql -u root -p halleyx_db < seed.sql
```

### Step 3 — Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

Both must be running at the same time.

---

## API Base URL
```
http://localhost:5000/api
```

## Auth Flow
1. Register or Login → receive `accessToken` + `refreshToken`
2. Send `Authorization: Bearer <accessToken>` on every API call
3. When token expires (7d), call `POST /api/auth/refresh` with `refreshToken`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Recharts, CSS Variables |
| Backend | Node.js, Express 4 |
| Database | MySQL 8 |
| Auth | JWT (access + refresh token rotation) |
| Security | bcryptjs, express-rate-limit, express-validator |

---

## Ports
| Service | Port |
|---|---|
| Frontend | 3000 |
| Backend API | 5000 |
