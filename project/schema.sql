-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYEE', 'CUSTOMER');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE payment_method AS ENUM ('CARD', 'TWINT', 'CASH', 'PAYPAL');

-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status booking_status DEFAULT 'PENDING',
  total_price DECIMAL(10,2) NOT NULL,
  payment_status payment_status DEFAULT 'PENDING',
  payment_method payment_method,
  reminder_email BOOLEAN DEFAULT true,
  reminder_sms BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create junction tables
CREATE TABLE package_services (
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, service_id)
);

CREATE TABLE booking_products (
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (booking_id, product_id)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_services_category ON services(category);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read all public data
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON packages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

-- Users can only see their own bookings, admins can see all
CREATE POLICY "Users can see own bookings" ON bookings FOR SELECT 
USING (auth.uid() = user_id OR auth.role() = 'ADMIN');

-- Create update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
    BEFORE UPDATE ON packages
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Insert initial admin user
INSERT INTO users (name, email, role)
VALUES ('Admin', 'admin@meliyah-afroshop.ch', 'ADMIN');

-- Insert sample services
INSERT INTO services (name, description, duration, price, category)
VALUES 
  ('Haarschnitt & Styling', 'Professioneller Haarschnitt mit Styling', 60, 80.00, 'hair'),
  ('Färben', 'Premium Haarfarbe mit Pflege', 120, 120.00, 'hair'),
  ('Luxus-Behandlung', 'Intensive Haarpflege mit hochwertigen Produkten', 45, 60.00, 'hair');

-- Insert sample packages
INSERT INTO packages (name, description, price, discount_percentage)
VALUES 
  ('Paket Platinum', 'Das ultimative Verwöhnprogramm für höchste Ansprüche', 260.00, 15),
  ('Paket Gold', 'Perfekte Kombination aus Pflege und Styling', 180.00, 10),
  ('Paket Silber', 'Klassische Behandlung für den gepflegten Look', 80.00, 0);

-- Link services to packages
INSERT INTO package_services (package_id, service_id)
SELECT 
  p.id,
  s.id
FROM packages p
CROSS JOIN services s
WHERE p.name = 'Paket Platinum';

INSERT INTO package_services (package_id, service_id)
SELECT 
  p.id,
  s.id
FROM packages p
CROSS JOIN services s
WHERE p.name = 'Paket Gold'
AND s.name IN ('Haarschnitt & Styling', 'Färben');

INSERT INTO package_services (package_id, service_id)
SELECT 
  p.id,
  s.id
FROM packages p
CROSS JOIN services s
WHERE p.name = 'Paket Silber'
AND s.name = 'Haarschnitt & Styling';