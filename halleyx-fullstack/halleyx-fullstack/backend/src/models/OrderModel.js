const { pool } = require('../config/db');

function generateOrderId(count) {
  return `ORD-${String(count + 1).padStart(3, '0')}`;
}
function generateCustomerId(count) {
  return `CUS-${String(count + 1).padStart(3, '0')}`;
}

const OrderModel = {
  async findAll({ dateRange } = {}) {
    let query = 'SELECT * FROM customer_orders';
    const params = [];

    if (dateRange && dateRange !== 'All time') {
      let interval;
      if (dateRange === 'Today') interval = 'INTERVAL 1 DAY';
      else if (dateRange === 'Last 7 Days') interval = 'INTERVAL 7 DAY';
      else if (dateRange === 'Last 30 Days') interval = 'INTERVAL 30 DAY';
      else if (dateRange === 'Last 90 Days') interval = 'INTERVAL 90 DAY';
      if (interval) {
        query += ` WHERE order_date >= DATE_SUB(CURDATE(), ${interval})`;
      }
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows.map(camelCase);
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM customer_orders WHERE id = ?', [id]);
    return rows[0] ? camelCase(rows[0]) : null;
  },

  async create(data) {
    const [countResult] = await pool.query('SELECT COUNT(*) as cnt FROM customer_orders');
    const count = countResult[0].cnt;
    const id = generateOrderId(count);
    const customerId = generateCustomerId(count);

    await pool.query(
      `INSERT INTO customer_orders
        (id, customer_id, first_name, last_name, email, phone, street, city, state, postal,
         country, product, quantity, unit_price, total_amount, status, created_by, order_date)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id, customerId,
        data.firstName, data.lastName, data.email, data.phone,
        data.street, data.city, data.state, data.postal, data.country,
        data.product, data.quantity, data.unitPrice,
        parseFloat((data.quantity * data.unitPrice).toFixed(2)),
        data.status || 'Pending', data.createdBy,
        data.orderDate || new Date().toISOString().slice(0, 10),
      ]
    );
    return this.findById(id);
  },

  async update(id, data) {
    const totalAmount = parseFloat((data.quantity * data.unitPrice).toFixed(2));
    await pool.query(
      `UPDATE customer_orders SET
        first_name=?, last_name=?, email=?, phone=?, street=?, city=?, state=?, postal=?,
        country=?, product=?, quantity=?, unit_price=?, total_amount=?, status=?, created_by=?
       WHERE id=?`,
      [
        data.firstName, data.lastName, data.email, data.phone,
        data.street, data.city, data.state, data.postal, data.country,
        data.product, data.quantity, data.unitPrice, totalAmount,
        data.status, data.createdBy, id,
      ]
    );
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM customer_orders WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async getStats() {
    const [[totals]] = await pool.query(`
      SELECT
        COUNT(*) AS totalOrders,
        SUM(total_amount) AS totalRevenue,
        AVG(total_amount) AS avgOrderValue,
        SUM(quantity) AS totalQuantity
      FROM customer_orders
    `);
    const [byStatus] = await pool.query(`
      SELECT status, COUNT(*) as count FROM customer_orders GROUP BY status
    `);
    const [byProduct] = await pool.query(`
      SELECT product, COUNT(*) as count, SUM(total_amount) as revenue
      FROM customer_orders GROUP BY product ORDER BY revenue DESC
    `);
    return {
      totals: {
        totalOrders: totals.totalOrders || 0,
        totalRevenue: parseFloat(totals.totalRevenue || 0).toFixed(2),
        avgOrderValue: parseFloat(totals.avgOrderValue || 0).toFixed(2),
        totalQuantity: totals.totalQuantity || 0,
      },
      byStatus,
      byProduct,
    };
  },
};

// snake_case → camelCase mapper
function camelCase(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    street: row.street,
    city: row.city,
    state: row.state,
    postal: row.postal,
    country: row.country,
    product: row.product,
    quantity: row.quantity,
    unitPrice: parseFloat(row.unit_price),
    totalAmount: parseFloat(row.total_amount),
    status: row.status,
    createdBy: row.created_by,
    orderDate: row.order_date instanceof Date
      ? row.order_date.toISOString().slice(0, 10)
      : String(row.order_date).slice(0, 10),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = OrderModel;
