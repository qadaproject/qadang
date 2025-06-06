-- Insert sample users
INSERT INTO users (id, email, first_name, last_name, phone, wallet_balance, reward_points, referral_code)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'john@example.com', 'John', 'Doe', '+2348012345678', 5000.00, 150, 'QADA123456'),
  ('22222222-2222-2222-2222-222222222222', 'jane@example.com', 'Jane', 'Smith', '+2348023456789', 7500.00, 250, 'QADA234567'),
  ('33333333-3333-3333-3333-333333333333', 'mike@example.com', 'Michael', 'Johnson', '+2348034567890', 3000.00, 100, 'QADA345678'),
  ('44444444-4444-4444-4444-444444444444', 'sarah@example.com', 'Sarah', 'Williams', '+2348045678901', 10000.00, 300, 'QADA456789'),
  ('55555555-5555-5555-5555-555555555555', 'david@example.com', 'David', 'Brown', '+2348056789012', 2500.00, 75, 'QADA567890')
ON CONFLICT (id) DO NOTHING;

-- Insert sample vendors
INSERT INTO vendors (id, email, business_name, phone, address, city, state, status, rating)
VALUES 
  ('66666666-6666-6666-6666-666666666666', 'luxurycars@example.com', 'Luxury Cars Nigeria', '+2348067890123', '123 Adeola Odeku St', 'Lagos', 'Lagos', 'active', 4.8),
  ('77777777-7777-7777-7777-777777777777', 'premiumrides@example.com', 'Premium Rides', '+2348078901234', '45 Awolowo Road', 'Lagos', 'Lagos', 'active', 4.5),
  ('88888888-8888-8888-8888-888888888888', 'abujarentals@example.com', 'Abuja Car Rentals', '+2348089012345', '78 Ahmadu Bello Way', 'Abuja', 'FCT', 'active', 4.2),
  ('99999999-9999-9999-9999-999999999999', 'royalcars@example.com', 'Royal Cars', '+2348090123456', '15 Eko Street', 'Lagos', 'Lagos', 'pending', 0),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'portharcourt@example.com', 'Port Harcourt Rentals', '+2348001234567', '32 Aba Road', 'Port Harcourt', 'Rivers', 'active', 4.0)
ON CONFLICT (id) DO NOTHING;
