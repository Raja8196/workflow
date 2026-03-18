require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { testConnection } = require('./config/db');
const { initDB } = require('./config/initDB');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes      = require('./routes/authRoutes');
const orderRoutes     = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// ==================== MIDDLEWARE ====================

// CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter (backup, routes have specific ones)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Request logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ==================== HEALTH CHECK ====================
app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'OK', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ==================== ROUTES ====================
app.use('/api/auth',      authRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ==================== ERROR HANDLING ====================
app.use(notFound);
app.use(globalErrorHandler);

// ==================== START ====================
const PORT = parseInt(process.env.PORT) || 5000;

async function start() {
  await testConnection();
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀  Halleyx API running on http://localhost:${PORT}`);
    console.log(`📋  Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗  Health: http://localhost:${PORT}/health`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
