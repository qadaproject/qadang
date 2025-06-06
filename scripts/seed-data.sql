-- Insert sample vendors
INSERT INTO vendors (business_name, email, phone, address, city, state, status, rating) VALUES
('Lagos Car Rentals', 'info@lagoscarrentals.ng', '+2348012345678', '123 Victoria Island Road', 'Lagos', 'Lagos', 'approved', 4.5),
('Abuja Premium Cars', 'contact@abujapremium.ng', '+2348023456789', '456 Wuse 2 District', 'Abuja', 'FCT', 'approved', 4.7),
('Port Harcourt Rentals', 'hello@phrentals.ng', '+2348034567890', '789 GRA Phase 1', 'Port Harcourt', 'Rivers', 'approved', 4.3),
('Kano Auto Services', 'info@kanoauto.ng', '+2348045678901', '321 Sabon Gari', 'Kano', 'Kano', 'approved', 4.2),
('Luxury Rides Nigeria', 'luxury@ridesng.com', '+2348056789012', '654 Ikoyi Lagos', 'Lagos', 'Lagos', 'approved', 4.8);

-- Insert sample cars
INSERT INTO cars (vendor_id, name, brand, model, year, price_per_day, transmission, fuel_type, seats, features, images, location, address, status, rating, total_bookings, is_available) VALUES
((SELECT id FROM vendors WHERE business_name = 'Lagos Car Rentals'), 'Toyota Camry 2022', 'Toyota', 'Camry', 2022, 15000, 'automatic', 'Petrol', 5, '{"AC", "Bluetooth", "GPS", "Backup Camera"}', '{"/placeholder.svg?height=300&width=400"}', 'Lagos', 'Victoria Island, Lagos', 'active', 4.5, 120, true),
((SELECT id FROM vendors WHERE business_name = 'Lagos Car Rentals'), 'Honda Accord 2021', 'Honda', 'Accord', 2021, 18000, 'automatic', 'Petrol', 5, '{"AC", "Bluetooth", "Sunroof", "Leather Seats"}', '{"/placeholder.svg?height=300&width=400"}', 'Lagos', 'Ikeja, Lagos', 'active', 4.3, 89, true),
((SELECT id FROM vendors WHERE business_name = 'Abuja Premium Cars'), 'Mercedes C-Class 2023', 'Mercedes', 'C-Class', 2023, 35000, 'automatic', 'Petrol', 5, '{"AC", "Bluetooth", "GPS", "Premium Sound", "Leather Seats"}', '{"/placeholder.svg?height=300&width=400"}', 'Abuja', 'Wuse 2, Abuja', 'active', 4.9, 156, true),
((SELECT id FROM vendors WHERE business_name = 'Abuja Premium Cars'), 'BMW 3 Series 2022', 'BMW', '3 Series', 2022, 32000, 'automatic', 'Petrol', 5, '{"AC", "Bluetooth", "GPS", "Sport Mode", "Leather Seats"}', '{"/placeholder.svg?height=300&width=400"}', 'Abuja', 'Garki, Abuja', 'active', 4.7, 98, true),
((SELECT id FROM vendors WHERE business_name = 'Port Harcourt Rentals'), 'Hyundai Elantra 2022', 'Hyundai', 'Elantra', 2022, 14000, 'automatic', 'Petrol', 5, '{"AC", "Bluetooth", "USB Port", "Backup Camera"}', '{"/placeholder.svg?height=300&width=400"}', 'Port Harcourt', 'GRA Phase 1, Port Harcourt', 'active', 4.4, 76, true),
((SELECT id FROM vendors WHERE business_name = 'Kano Auto Services'), 'Kia Picanto 2021', 'Kia', 'Picanto', 2021, 10000, 'manual', 'Petrol', 4, '{"AC", "Radio", "USB Port"}', '{"/placeholder.svg?height=300&width=400"}', 'Kano', 'Sabon Gari, Kano', 'active', 4.1, 45, true),
((SELECT id FROM vendors WHERE business_name = 'Luxury Rides Nigeria'), 'Range Rover Evoque 2023', 'Range Rover', 'Evoque', 2023, 55000, 'automatic', 'Petrol', 5, '{"AC", "Bluetooth", "GPS", "Premium Sound", "Leather Seats", "Panoramic Roof"}', '{"/placeholder.svg?height=300&width=400"}', 'Lagos', 'Lekki Phase 1, Lagos', 'active', 4.9, 203, true),
((SELECT id FROM vendors WHERE business_name = 'Luxury Rides Nigeria'), 'Audi A4 2022', 'Audi', 'A4', 2022, 38000, 'automatic', 'Petrol', 5, '{"AC", "Bluetooth", "GPS", "Sport Mode", "Leather Seats"}', '{"/placeholder.svg?height=300&width=400"}', 'Lagos', 'Victoria Island, Lagos', 'active', 4.6, 134, true);

-- Insert sample drivers
INSERT INTO drivers (vendor_id, first_name, last_name, phone, email, license_number, experience_years, rating, status, hourly_rate, is_available) VALUES
((SELECT id FROM vendors WHERE business_name = 'Lagos Car Rentals'), 'John', 'Doe', '+2348012345678', 'john.doe@email.com', 'LG123456789', 8, 4.8, 'available', 2000, true),
((SELECT id FROM vendors WHERE business_name = 'Lagos Car Rentals'), 'Mary', 'Johnson', '+2348023456789', 'mary.johnson@email.com', 'LG987654321', 5, 4.5, 'available', 1800, true),
((SELECT id FROM vendors WHERE business_name = 'Abuja Premium Cars'), 'Ahmed', 'Ibrahim', '+2348034567890', 'ahmed.ibrahim@email.com', 'AB123456789', 10, 4.9, 'available', 2500, true),
((SELECT id FROM vendors WHERE business_name = 'Port Harcourt Rentals'), 'Grace', 'Okoro', '+2348045678901', 'grace.okoro@email.com', 'PH123456789', 6, 4.6, 'available', 1900, true),
((SELECT id FROM vendors WHERE business_name = 'Luxury Rides Nigeria'), 'David', 'Williams', '+2348056789012', 'david.williams@email.com', 'LG555666777', 12, 4.9, 'available', 3000, true);

-- Insert sample discounts
INSERT INTO discounts (code, type, value, min_amount, max_discount, usage_limit, used_count, valid_from, valid_until, status) VALUES
('WELCOME10', 'percentage', 10, 10000, 5000, 100, 0, NOW(), NOW() + INTERVAL '30 days', 'active'),
('SAVE5000', 'fixed', 5000, 20000, 5000, 50, 0, NOW(), NOW() + INTERVAL '15 days', 'active'),
('NEWUSER20', 'percentage', 20, 15000, 10000, 200, 0, NOW(), NOW() + INTERVAL '60 days', 'active'),
('LUXURY15', 'percentage', 15, 30000, 15000, 25, 0, NOW(), NOW() + INTERVAL '45 days', 'active');

-- Insert sample users (for testing)
INSERT INTO users (email, first_name, last_name, phone, wallet_balance, reward_points, referral_code) VALUES
('test@example.com', 'Test', 'User', '+2348012345678', 50000, 250, 'TEST1234'),
('demo@example.com', 'Demo', 'User', '+2348023456789', 25000, 150, 'DEMO5678');

-- Update car ratings based on sample data
UPDATE cars SET rating = 4.5, total_bookings = 120 WHERE name = 'Toyota Camry 2022';
UPDATE cars SET rating = 4.3, total_bookings = 89 WHERE name = 'Honda Accord 2021';
UPDATE cars SET rating = 4.9, total_bookings = 156 WHERE name = 'Mercedes C-Class 2023';
UPDATE cars SET rating = 4.7, total_bookings = 98 WHERE name = 'BMW 3 Series 2022';
UPDATE cars SET rating = 4.4, total_bookings = 76 WHERE name = 'Hyundai Elantra 2022';
UPDATE cars SET rating = 4.1, total_bookings = 45 WHERE name = 'Kia Picanto 2021';
UPDATE cars SET rating = 4.9, total_bookings = 203 WHERE name = 'Range Rover Evoque 2023';
UPDATE cars SET rating = 4.6, total_bookings = 134 WHERE name = 'Audi A4 2022';
