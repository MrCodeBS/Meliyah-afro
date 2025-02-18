-- Insert sample data for testing

-- Insert services
INSERT INTO services (name, description, duration, price, category) VALUES
('Haarschnitt & Styling', 'Professioneller Haarschnitt mit Styling', 60, 80.00, 'hair'),
('Färben', 'Premium Haarfarbe mit Pflege', 120, 120.00, 'hair'),
('Luxus-Behandlung', 'Intensive Haarpflege mit hochwertigen Produkten', 45, 60.00, 'hair');

-- Insert packages
INSERT INTO packages (name, description, price, discount_percentage) VALUES
('Paket Platinum', 'Das ultimative Verwöhnprogramm', 260.00, 15),
('Paket Gold', 'Perfekte Kombination aus Pflege und Styling', 180.00, 10),
('Paket Silber', 'Klassische Behandlung für den gepflegten Look', 80.00, 0);

-- Insert sample customers
INSERT INTO users (name, email, phone, role) VALUES
('Anna Müller', 'anna.mueller@example.com', '+41 79 123 45 67', 'CUSTOMER'),
('Sarah Weber', 'sarah.weber@example.com', '+41 78 987 65 43', 'CUSTOMER'),
('Michael Schmidt', 'michael.schmidt@example.com', '+41 76 555 44 33', 'CUSTOMER');

-- Insert sample bookings
INSERT INTO bookings (
  user_id,
  package_id,
  date,
  time,
  status,
  total_price,
  payment_status,
  payment_method
) 
SELECT 
  u.id,
  p.id,
  CURRENT_DATE + (i || ' days')::interval,
  CASE (i % 3) 
    WHEN 0 THEN '09:00'
    WHEN 1 THEN '14:00'
    ELSE '16:00'
  END,
  CASE (i % 3)
    WHEN 0 THEN 'CONFIRMED'
    WHEN 1 THEN 'PENDING'
    ELSE 'COMPLETED'
  END,
  p.price,
  CASE (i % 2)
    WHEN 0 THEN 'COMPLETED'
    ELSE 'PENDING'
  END,
  CASE (i % 3)
    WHEN 0 THEN 'CARD'
    WHEN 1 THEN 'TWINT'
    ELSE 'CASH'
  END
FROM 
  users u 
  CROSS JOIN packages p,
  generate_series(0, 10) i
WHERE 
  u.role = 'CUSTOMER'
LIMIT 20;