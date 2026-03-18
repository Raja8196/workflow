const OrderModel = require('../models/OrderModel');

const OrderController = {
  // GET /api/orders
  async getAll(req, res, next) {
    try {
      const { dateRange } = req.query;
      const orders = await OrderModel.findAll({ dateRange });
      return res.json({ success: true, data: { orders, total: orders.length } });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/orders/stats
  async getStats(req, res, next) {
    try {
      const stats = await OrderModel.getStats();
      return res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/orders/:id
  async getOne(req, res, next) {
    try {
      const order = await OrderModel.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: { order } });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/orders
  async create(req, res, next) {
    try {
      const order = await OrderModel.create(req.body);
      return res.status(201).json({ success: true, message: 'Order created successfully', data: { order } });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/orders/:id
  async update(req, res, next) {
    try {
      const existing = await OrderModel.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Order not found' });

      const order = await OrderModel.update(req.params.id, req.body);
      return res.json({ success: true, message: 'Order updated successfully', data: { order } });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/orders/:id
  async delete(req, res, next) {
    try {
      const deleted = await OrderModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = OrderController;
