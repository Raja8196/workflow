const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const OrderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { handleValidation } = require('../middleware/errorHandler');

const PRODUCTS = [
  'Fiber Internet 300 Mbps', '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps', 'Business Internet 500 Mbps', 'VoIP Corporate Package',
];
const COUNTRIES = ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'];
const STATUSES  = ['Pending', 'In progress', 'Completed'];
const CREATORS  = ['Mr. Michael Harris', 'Mr. Ryan Cooper', 'Ms. Olivia Carter', 'Mr. Lucas Martin'];

const orderRules = [
  body('firstName').trim().notEmpty().withMessage('Please fill the field'),
  body('lastName').trim().notEmpty().withMessage('Please fill the field'),
  body('email').isEmail().withMessage('Please fill the field'),
  body('phone').trim().notEmpty().withMessage('Please fill the field'),
  body('street').trim().notEmpty().withMessage('Please fill the field'),
  body('city').trim().notEmpty().withMessage('Please fill the field'),
  body('state').trim().notEmpty().withMessage('Please fill the field'),
  body('postal').trim().notEmpty().withMessage('Please fill the field'),
  body('country').isIn(COUNTRIES).withMessage('Please fill the field'),
  body('product').isIn(PRODUCTS).withMessage('Please fill the field'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity cannot be less than 1'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Please fill the field'),
  body('status').isIn(STATUSES).withMessage('Please fill the field'),
  body('createdBy').isIn(CREATORS).withMessage('Please fill the field'),
];

// All order routes require authentication
router.use(authenticate);

// @route   GET /api/orders
router.get('/', OrderController.getAll);

// @route   GET /api/orders/stats
router.get('/stats', OrderController.getStats);

// @route   GET /api/orders/:id
router.get('/:id', OrderController.getOne);

// @route   POST /api/orders
router.post('/', orderRules, handleValidation, OrderController.create);

// @route   PUT /api/orders/:id
router.put('/:id', orderRules, handleValidation, OrderController.update);

// @route   DELETE /api/orders/:id
router.delete('/:id', OrderController.delete);

module.exports = router;
