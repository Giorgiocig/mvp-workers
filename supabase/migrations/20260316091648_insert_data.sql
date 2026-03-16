-- Insert default users (5 workers + 1 manager)
-- IMPORTANT: Change manager password hash before production!
INSERT INTO users (name, role, password_hash) VALUES
  ('Marco', 'worker', NULL),
  ('Luca', 'worker', NULL),
  ('Andrea', 'worker', NULL),
  ('Giuseppe', 'worker', NULL),
  ('Francesco', 'worker', NULL),
  ('Manager', 'manager', '$2a$10$N9qo8uLOickgx2ZEs2jxYeXQZV8/5xzKDJPw8h6K4ZlGS4q9D7V0u');
 
-- Insert sample production orders
INSERT INTO production_orders (order_number, description, status, assigned_to) VALUES
  ('ORD-001', 'Produzione componenti serie A', 'in_progress', (SELECT id FROM users WHERE name = 'Marco')),
  ('ORD-002', 'Assemblaggio unità B', 'pending', NULL),
  ('ORD-003', 'Controllo qualità lotto C', 'completed', (SELECT id FROM users WHERE name = 'Luca'));
 