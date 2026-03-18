const express = require('express');
const router = express.Router();

const DashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// @route   GET /api/dashboard
router.get('/', DashboardController.get);

// @route   POST /api/dashboard
router.post('/', DashboardController.save);

// @route   DELETE /api/dashboard
router.delete('/', DashboardController.reset);

module.exports = router;
