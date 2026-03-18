-- ============================================================
-- Halleyx Dashboard - MySQL Seed Data
-- Run this AFTER the server starts (tables auto-created)
-- ============================================================

USE halleyx_db;

-- Sample orders (run only if table is empty)
INSERT IGNORE INTO customer_orders
  (id, customer_id, first_name, last_name, email, phone, street, city, state, postal, country, product, quantity, unit_price, total_amount, status, created_by, order_date)
VALUES
  ('ORD-001','CUS-001','Alice','Johnson','alice@example.com','555-1001','123 Maple St','New York','NY','10001','United States','Fiber Internet 1 Gbps',2,89.99,179.98,'Completed','Mr. Michael Harris','2024-01-15'),
  ('ORD-002','CUS-002','Bob','Smith','bob@example.com','555-1002','456 Oak Ave','Los Angeles','CA','90001','United States','5G Unlimited Mobile Plan',3,49.99,149.97,'In progress','Ms. Olivia Carter','2024-01-18'),
  ('ORD-003','CUS-003','Carol','White','carol@example.com','555-1003','789 Pine Rd','Toronto','ON','M5H2N2','Canada','Business Internet 500 Mbps',1,149.99,149.99,'Pending','Mr. Ryan Cooper','2024-01-20'),
  ('ORD-004','CUS-004','David','Lee','david@example.com','555-1004','321 Elm St','Sydney','NSW','2000','Australia','VoIP Corporate Package',5,29.99,149.95,'Completed','Mr. Lucas Martin','2024-01-22'),
  ('ORD-005','CUS-005','Eva','Chen','eva@example.com','555-1005','654 Cedar Blvd','Singapore','SG','018960','Singapore','Fiber Internet 300 Mbps',1,59.99,59.99,'In progress','Mr. Michael Harris','2024-01-25'),
  ('ORD-006','CUS-006','Frank','Nguyen','frank@example.com','555-1006','987 Birch Lane','Hong Kong','HK','00000','Hong Kong','Fiber Internet 1 Gbps',2,89.99,179.98,'Completed','Ms. Olivia Carter','2024-02-01'),
  ('ORD-007','CUS-007','Grace','Kim','grace@example.com','555-1007','147 Walnut Dr','Chicago','IL','60601','United States','5G Unlimited Mobile Plan',4,49.99,199.96,'Pending','Mr. Lucas Martin','2024-02-05'),
  ('ORD-008','CUS-008','Henry','Patel','henry@example.com','555-1008','258 Spruce St','Melbourne','VIC','3000','Australia','Business Internet 500 Mbps',2,149.99,299.98,'Completed','Mr. Ryan Cooper','2024-02-08');
