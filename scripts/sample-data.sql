-- Insert sample vendors
INSERT INTO vendors (business_name, email, phone, address, city, state, status, rating, profile_image)
VALUES
  ('Lagos Premium Cars', 'info@lagospremiumcars.com', '+234 801 234 5678', '123 Broad Street', 'Lagos', 'Lagos', 'approved', 4.8, '/placeholder.svg?height=200&width=200'),
  ('Abuja Rentals', 'contact@abujarentals.com', '+234 802 345 6789', '45 Wuse Zone 5', 'Abuja', 'FCT', 'approved', 4.5, '/placeholder.svg?height=200&width=200'),
  ('Port Harcourt Wheels', 'hello@phwheels.com', '+234 803 456 7890', '78 Aba Road', 'Port Harcourt', 'Rivers', 'approved', 4.7, '/placeholder.svg?height=200&width=200'),
  ('Kano Motors', 'info@kanomotors.com', '+234 804 567 8901', '15 Kano Road', 'Kano', 'Kano', 'approved', 4.3, '/placeholder.svg?height=200&width=200')
ON CONFLICT DO NOTHING;

-- Insert sample users
INSERT INTO users (email, first_name, last_name, phone, wallet_balance, reward_points, email_verified)
VALUES
  ('john@example.com', 'John', 'Doe', '+234 805 678 9012', 25000.00, 150, TRUE),
  ('mary@example.com', 'Mary', 'Smith', '+234 806 789 0123', 15000.00, 75, TRUE),
  ('david@example.com', 'David', 'Johnson', '+234 807 890 1234', 5000.00, 30, TRUE),
  ('sarah@example.com', 'Sarah', 'Williams', '+234 808 901 2345', 0.00, 0, TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample admin
INSERT INTO admins (email, first_name, last_name, role, email_verified, two_factor_enabled)
VALUES
  ('admin@qada.ng', 'Admin', 'User', 'super_admin', TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- Get vendor IDs
DO $$
DECLARE
  lagos_vendor_id UUID;
  abuja_vendor_id UUID;
  ph_vendor_id UUID;
  kano_vendor_id UUID;
BEGIN
  SELECT id INTO lagos_vendor_id FROM vendors WHERE business_name = 'Lagos Premium Cars' LIMIT 1;
  SELECT id INTO abuja_vendor_id FROM vendors WHERE business_name = 'Abuja Rentals' LIMIT 1;
  SELECT id INTO ph_vendor_id FROM vendors WHERE business_name = 'Port Harcourt Wheels' LIMIT 1;
  SELECT id INTO kano_vendor_id FROM vendors WHERE business_name = 'Kano Motors' LIMIT 1;

  -- Insert sample cars
  INSERT INTO cars (
    vendor_id, make, model, year, color, license_plate, vin, transmission, fuel_type, 
    engine_size, seats, doors, daily_rate, weekly_rate, monthly_rate, security_deposit,
    self_drive_available, with_driver_available, driver_daily_rate, location, city, state,
    mileage, condition, features, primary_image_url, image_urls, status, is_available
  )
  VALUES
    -- Lagos Premium Cars
    (
      lagos_vendor_id, 'Toyota', 'Camry', 2022, 'Black', 'LND-123-AB', 'JT2BF22K1W0123456',
      'automatic', 'petrol', 2.5, 5, 4, 25000.00, 150000.00, 500000.00, 50000.00,
      TRUE, TRUE, 5000.00, 'Victoria Island', 'Lagos', 'Lagos',
      15000, 'excellent', ARRAY['Air Conditioning', 'Bluetooth', 'Reverse Camera', 'Leather Seats', 'GPS Navigation'],
      '/placeholder.svg?height=400&width=600', 
      ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
      'active', TRUE
    ),
    (
      lagos_vendor_id, 'Mercedes-Benz', 'E-Class', 2021, 'Silver', 'LND-456-CD', 'WDDZF4JB6KA123456',
      'automatic', 'petrol', 3.0, 5, 4, 45000.00, 270000.00, 900000.00, 100000.00,
      TRUE, TRUE, 8000.00, 'Ikoyi', 'Lagos', 'Lagos',
      20000, 'excellent', ARRAY['Air Conditioning', 'Bluetooth', 'Leather Seats', 'Sunroof', 'GPS Navigation', 'Premium Sound System'],
      '/placeholder.svg?height=400&width=600', 
      ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
      'active', TRUE
    ),
    
    -- Abuja Rentals
    (
      abuja_vendor_id, 'Honda', 'Accord', 2020, 'Blue', 'ABJ-789-EF', '1HGCM82633A123456',
      'automatic', 'petrol', 2.0, 5, 4, 20000.00, 120000.00, 400000.00, 40000.00,
      TRUE, TRUE, 4000.00, 'Wuse', 'Abuja', 'FCT',
      25000, 'good', ARRAY['Air Conditioning', 'Bluetooth', 'USB Port', 'Cruise Control'],
      '/placeholder.svg?height=400&width=600', 
      ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
      'active', TRUE
    ),
    (
      abuja_vendor_id, 'Toyota', 'Highlander', 2021, 'White', 'ABJ-012-GH', '5TDZA23C13S123456',
      'automatic', 'petrol', 3.5, 7, 5, 35000.00, 210000.00, 700000.00, 70000.00,
      TRUE, TRUE, 6000.00, 'Maitama', 'Abuja', 'FCT',
      18000, 'excellent', ARRAY['Air Conditioning', 'Bluetooth', 'Leather Seats', '3rd Row Seating', 'Reverse Camera', 'GPS Navigation'],
      '/placeholder.svg?height=400&width=600', 
      ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
      'active', TRUE
    ),
    
    -- Port Harcourt Wheels
    (
      ph_vendor_id, 'Lexus', 'RX 350', 2020, 'Black', 'PHC-345-IJ', '2T2BK1BA7CC123456',
      'automatic', 'petrol', 3.5, 5, 5, 40000.00, 240000.00, 800000.00, 80000.00,
      TRUE, TRUE, 7000.00, 'GRA', 'Port Harcourt', 'Rivers',
      22000, 'excellent', ARRAY['Air Conditioning', 'Bluetooth', 'Leather Seats', 'Sunroof', 'GPS Navigation', 'Premium Sound System'],
      '/placeholder.svg?height=400&width=600', 
      ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
      'active', TRUE
    ),
    (
      ph_vendor_id, 'Toyota', 'Corolla', 2021, 'Silver', 'PHC-678-KL', '2T1BR32E13C123456',
      'automatic', 'petrol', 1.8, 5, 4, 18000.00, 108000.00, 360000.00, 36000.00,
      TRUE, TRUE, 4000.00, 'Trans Amadi', 'Port Harcourt', 'Rivers',
      15000, 'good', ARRAY['Air Conditioning', 'Bluetooth', 'USB Port', 'Cruise Control'],
      '/placeholder.svg?height=400&width=600', 
      ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
      'active', TRUE
    ),
    
    -- Kano Motors
    (
      kano_vendor_id, 'Hyundai', 'Elantra', 2020, 'Red', 'KAN-901-MN', 'KMHDU46D09U123456',
      'automatic', 'petrol', 2.0, 5, 4, 15000.00, 90000.00, 300000.00, 30000.00,
      TRUE, TRUE, 3500.00, 'Nasarawa', 'Kano', 'Kano',
      30000, 'good', ARRAY['Air Conditioning', 'Bluetooth', 'USB Port'],
      '/placeholder.svg?height=400&width=600', 
      ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
      'active', TRUE
    ),
    (
      kano_vendor_id, 'Kia', 'Sportage', 2021, 'Gray', 'KAN-234-OP', 'KNDPB3A29B7123456',
      'automatic', 'petrol', 2.4, 5, 5, 22000.00, 132000.00, 440000.00, 44000.00,
      TRUE, TRUE, 5000.00, 'Bompai', 'Kano', 'Kano',
      18000, 'excellent', ARRAY['Air Conditioning', 'Bluetooth', 'Reverse Camera', 'Cruise Control', 'GPS Navigation'],
      '/placeholder.svg?height=400&width=600', 
      ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=400&width=600'],
      'active', TRUE
    );

  -- Insert sample drivers
  INSERT INTO drivers (
    vendor_id, first_name, last_name, phone, email, license_number, license_expiry,
    experience_years, hourly_rate, daily_rate, status, is_available, profile_image
  )
  VALUES
    -- Lagos Premium Cars drivers
    (
      lagos_vendor_id, 'Ade', 'Johnson', '+234 809 012 3456', 'ade@example.com',
      'LDL12345678', '2025-12-31', 8, 1500.00, 10000.00, 'available', TRUE,
      '/placeholder.svg?height=200&width=200'
    ),
    (
      lagos_vendor_id, 'Tunde', 'Bakare', '+234 810 123 4567', 'tunde@example.com',
      'LDL23456789', '2024-10-15', 5, 1200.00, 8000.00, 'available', TRUE,
      '/placeholder.svg?height=200&width=200'
    ),
    
    -- Abuja Rentals drivers
    (
      abuja_vendor_id, 'Ibrahim', 'Mohammed', '+234 811 234 5678', 'ibrahim@example.com',
      'ADL34567890', '2025-08-22', 7, 1400.00, 9000.00, 'available', TRUE,
      '/placeholder.svg?height=200&width=200'
    ),
    (
      abuja_vendor_id, 'Fatima', 'Usman', '+234 812 345 6789', 'fatima@example.com',
      'ADL45678901', '2024-11-30', 4, 1300.00, 8500.00, 'available', TRUE,
      '/placeholder.svg?height=200&width=200'
    ),
    
    -- Port Harcourt Wheels drivers
    (
      ph_vendor_id, 'Emeka', 'Okafor', '+234 813 456 7890', 'emeka@example.com',
      'PDL56789012', '2025-06-18', 6, 1350.00, 9000.00, 'available', TRUE,
      '/placeholder.svg?height=200&width=200'
    ),
    
    -- Kano Motors drivers
    (
      kano_vendor_id, 'Musa', 'Abdullahi', '+234 814 567 8901', 'musa@example.com',
      'KDL67890123', '2024-09-25', 9, 1200.00, 8000.00, 'available', TRUE,
      '/placeholder.svg?height=200&width=200'
    );

  -- Insert sample discounts
  INSERT INTO discounts (
    code, type, value, min_amount, max_discount, usage_limit, used_count,
    valid_from, valid_until, status
  )
  VALUES
    (
      'WELCOME10', 'percentage', 10.00, 10000.00, 5000.00, 1, 0,
      NOW(), NOW() + INTERVAL '30 days', 'active'
    ),
    (
      'WEEKEND25', 'percentage', 25.00, 20000.00, 10000.00, 100, 0,
      NOW(), NOW() + INTERVAL '90 days', 'active'
    ),
    (
      'NAIRA5000', 'fixed', 5000.00, 15000.00, 5000.00, 50, 0,
      NOW(), NOW() + INTERVAL '60 days', 'active'
    );

END $$;

-- Map cars to categories
DO $$
DECLARE
  economy_id UUID;
  midsize_id UUID;
  luxury_id UUID;
  suv_id UUID;
  car_id UUID;
BEGIN
  SELECT id INTO economy_id FROM car_categories WHERE name = 'Economy' LIMIT 1;
  SELECT id INTO midsize_id FROM car_categories WHERE name = 'Mid-size' LIMIT 1;
  SELECT id INTO luxury_id FROM car_categories WHERE name = 'Luxury' LIMIT 1;
  SELECT id INTO suv_id FROM car_categories WHERE name = 'SUV' LIMIT 1;
  
  -- Toyota Corolla - Economy
  SELECT id INTO car_id FROM cars WHERE model = 'Corolla' LIMIT 1;
  IF car_id IS NOT NULL AND economy_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, economy_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Hyundai Elantra - Economy
  SELECT id INTO car_id FROM cars WHERE model = 'Elantra' LIMIT 1;
  IF car_id IS NOT NULL AND economy_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, economy_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Honda Accord - Mid-size
  SELECT id INTO car_id FROM cars WHERE model = 'Accord' LIMIT 1;
  IF car_id IS NOT NULL AND midsize_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, midsize_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Toyota Camry - Mid-size
  SELECT id INTO car_id FROM cars WHERE model = 'Camry' LIMIT 1;
  IF car_id IS NOT NULL AND midsize_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, midsize_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Mercedes-Benz E-Class - Luxury
  SELECT id INTO car_id FROM cars WHERE model = 'E-Class' LIMIT 1;
  IF car_id IS NOT NULL AND luxury_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, luxury_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Lexus RX 350 - Luxury & SUV
  SELECT id INTO car_id FROM cars WHERE model = 'RX 350' LIMIT 1;
  IF car_id IS NOT NULL AND luxury_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, luxury_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  IF car_id IS NOT NULL AND suv_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, suv_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Toyota Highlander - SUV
  SELECT id INTO car_id FROM cars WHERE model = 'Highlander' LIMIT 1;
  IF car_id IS NOT NULL AND suv_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, suv_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Kia Sportage - SUV
  SELECT id INTO car_id FROM cars WHERE model = 'Sportage' LIMIT 1;
  IF car_id IS NOT NULL AND suv_id IS NOT NULL THEN
    INSERT INTO car_category_mappings (car_id, category_id)
    VALUES (car_id, suv_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
