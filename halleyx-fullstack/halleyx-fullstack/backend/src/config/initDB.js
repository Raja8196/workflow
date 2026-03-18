const { pool } = require('../config/db');

async function initDB() {
  const conn = await pool.getConnection();
  try {
    // Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        first_name  VARCHAR(100) NOT NULL,
        last_name   VARCHAR(100) NOT NULL,
        email       VARCHAR(255) NOT NULL UNIQUE,
        password    VARCHAR(255) NOT NULL,
        role        ENUM('admin','user') DEFAULT 'user',
        is_active   TINYINT(1) DEFAULT 1,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Refresh tokens table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL,
        token       VARCHAR(512) NOT NULL,
        expires_at  DATETIME NOT NULL,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Customer orders table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS customer_orders (
        id            VARCHAR(20) PRIMARY KEY,
        customer_id   VARCHAR(20) NOT NULL,
        first_name    VARCHAR(100) NOT NULL,
        last_name     VARCHAR(100) NOT NULL,
        email         VARCHAR(255) NOT NULL,
        phone         VARCHAR(30) NOT NULL,
        street        VARCHAR(255) NOT NULL,
        city          VARCHAR(100) NOT NULL,
        state         VARCHAR(100) NOT NULL,
        postal        VARCHAR(20) NOT NULL,
        country       VARCHAR(100) NOT NULL,
        product       VARCHAR(200) NOT NULL,
        quantity      INT NOT NULL DEFAULT 1,
        unit_price    DECIMAL(10,2) NOT NULL,
        total_amount  DECIMAL(10,2) NOT NULL,
        status        ENUM('Pending','In progress','Completed') DEFAULT 'Pending',
        created_by    VARCHAR(200) NOT NULL,
        order_date    DATE NOT NULL,
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Dashboard layouts table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS dashboard_layouts (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL UNIQUE,
        layout_json LONGTEXT NOT NULL,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅  All tables initialized');
  } finally {
    conn.release();
  }
}

module.exports = { initDB };
