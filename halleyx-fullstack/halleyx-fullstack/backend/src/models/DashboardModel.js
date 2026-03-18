const { pool } = require('../config/db');

const DashboardModel = {
  async getByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT layout_json, updated_at FROM dashboard_layouts WHERE user_id = ?',
      [userId]
    );
    if (!rows.length) return null;
    try {
      return { layout: JSON.parse(rows[0].layout_json), updatedAt: rows[0].updated_at };
    } catch {
      return null;
    }
  },

  async save(userId, layout) {
    const json = JSON.stringify(layout);
    await pool.query(
      `INSERT INTO dashboard_layouts (user_id, layout_json)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE layout_json = VALUES(layout_json)`,
      [userId, json]
    );
  },

  async delete(userId) {
    await pool.query('DELETE FROM dashboard_layouts WHERE user_id = ?', [userId]);
  },
};

module.exports = DashboardModel;
