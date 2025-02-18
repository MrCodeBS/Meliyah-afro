-- Initial admin user setup
INSERT INTO users (
  name, 
  email, 
  role,
  phone
) VALUES (
  'Caroline Gbati',
  'info@meliyahafrohair.ch',
  'ADMIN',
  '0774471179'
) ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone;