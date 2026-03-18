const DashboardModel = require('../models/DashboardModel');

const DashboardController = {
  // GET /api/dashboard
  async get(req, res, next) {
    try {
      const result = await DashboardModel.getByUserId(req.user.id);
      return res.json({ success: true, data: result || { layout: [], updatedAt: null } });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/dashboard
  async save(req, res, next) {
    try {
      const { layout } = req.body;
      if (!Array.isArray(layout)) {
        return res.status(400).json({ success: false, message: 'layout must be an array' });
      }
      await DashboardModel.save(req.user.id, layout);
      return res.json({ success: true, message: 'Dashboard saved successfully' });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/dashboard
  async reset(req, res, next) {
    try {
      await DashboardModel.delete(req.user.id);
      return res.json({ success: true, message: 'Dashboard reset successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = DashboardController;
