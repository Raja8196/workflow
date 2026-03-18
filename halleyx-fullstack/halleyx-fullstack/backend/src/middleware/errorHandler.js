const { validationResult } = require('express-validator');

// Validation error handler - call after express-validator rules
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = {};
    errors.array().forEach(e => { formatted[e.path] = e.msg; });
    return res.status(422).json({ success: false, message: 'Validation failed', errors: formatted });
  }
  next();
}

// Global error handler - last middleware in chain
function globalErrorHandler(err, req, res, next) {
  console.error('🔴 Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

// 404 handler
function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}

module.exports = { handleValidation, globalErrorHandler, notFound };
