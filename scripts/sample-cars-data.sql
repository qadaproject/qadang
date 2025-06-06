-- Insert sample cars data
INSERT INTO cars (
  vendor_id, make, model, year, color, license_plate, vin,
  transmission, fuel_type, engine_size, seats, doors, air_conditioning,
  daily_rate, weekly_rate, monthly_rate, security_deposit,
  self_drive_available, with_driver_available, driver_daily_rate,
  location, city, state, country,
  pickup_locations, mileage, condition, features,
  primary_image_url, image_urls,
  status, is_available, availability_start, availability_end,
  insurance_valid_until, registration_valid_until
) VALUES
-- Economy Cars
(
  (SELECT id FROM vendors WHERE business_name = 'Lagos Car Rentals' LIMIT 1),
  'Toyota', 'Corolla', 2022, 'White', 'LAG-123-ABC', 'JT2BF28K123456789',
  'automatic', 'petrol', 1.8, 5, 4, true,
  15000, 90000, 350000, 50000,
  true, true, 8000,
  'Victoria Island', 'Lagos', 'Lagos', 'Nigeria',
  ARRAY['Victoria Island', 'Ikoyi', 'Lekki'], 25000, 'excellent',
  ARRAY['GPS', 'Bluetooth', 'USB', 'Air Conditioning', 'Power Steering'],
  '/placeholder.svg?height=300&width=400',
  ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
  'active', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
  CURRENT_DATE + INTERVAL '6 months', CURRENT_DATE + INTERVAL '1 year'
),
(
  (SELECT id FROM vendors WHERE business_name = 'Abuja Premium Cars' LIMIT 1),
  'Honda', 'Civic', 2021, 'Silver', 'ABJ-456-DEF', 'JH4KA7561MC123456',
  'automatic', 'petrol', 1.5, 5, 4, true,
  18000, 108000, 420000, 60000,
  true, true, 10000,
  'Wuse 2', 'Abuja', 'FCT', 'Nigeria',
  ARRAY['Wuse 2', 'Garki', 'Maitama'], 18000, 'excellent',
  ARRAY['GPS', 'Bluetooth', 'Backup Camera', 'Cruise Control'],
  '/placeholder.svg?height=300&width=400',
  ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
  'active', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
  CURRENT_DATE + INTERVAL '8 months', CURRENT_DATE + INTERVAL '1 year'
),

-- Mid-size Cars
(
  (SELECT id FROM vendors WHERE business_name = 'Lagos Car Rentals' LIMIT 1),
  'Toyota', 'Camry', 2023, 'Black', 'LAG-789-GHI', 'JT2BF28K987654321',
  'automatic', 'petrol', 2.5, 5, 4, true,
  25000, 150000, 580000, 80000,
  true, true, 12000,
  'Ikeja', 'Lagos', 'Lagos', 'Nigeria',
  ARRAY['Ikeja', 'Maryland', 'Ojodu'], 12000, 'excellent',
  ARRAY['GPS', 'Bluetooth', 'Leather Seats', 'Sunroof', 'Premium Sound'],
  '/placeholder.svg?height=300&width=400',
  ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
  'active', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
  CURRENT_DATE + INTERVAL '10 months', CURRENT_DATE + INTERVAL '1 year'
),
(
  (SELECT id FROM vendors WHERE business_name = 'Port Harcourt Wheels' LIMIT 1),
  'Nissan', 'Altima', 2022, 'Blue', 'PH-321-JKL', 'JN1CV6AP1CM123456',
  'automatic', 'petrol', 2.0, 5, 4, true,
  22000, 132000, 510000, 70000,
  true, true, 11000,
  'GRA', 'Port Harcourt', 'Rivers', 'Nigeria',
  ARRAY['GRA', 'Trans Amadi', 'Eleme'], 20000, 'good',
  ARRAY['GPS', 'Bluetooth', 'Backup Camera', 'Heated Seats'],
  '/placeholder.svg?height=300&width=400',
  ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
  'active', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
  CURRENT_DATE + INTERVAL '7 months', CURRENT_DATE + INTERVAL '1 year'
),

-- SUVs
(
  (SELECT id FROM vendors WHERE business_name = 'Abuja Premium Cars' LIMIT 1),
  'Toyota', 'Highlander', 2023, 'White', 'ABJ-654-MNO', 'JTEEAAW10MD123456',
  'automatic', 'petrol', 3.5, 8, 4, true,
  35000, 210000, 820000, 120000,
  true, true, 15000,
  'Maitama', 'Abuja', 'FCT', 'Nigeria',
  ARRAY['Maitama', 'Asokoro', 'Wuse'], 8000, 'excellent',
  ARRAY['GPS', 'Bluetooth', 'Third Row Seating', 'All-Wheel Drive', 'Premium Audio'],
  '/placeholder.svg?height=300&width=400',
  ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
  'active', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
  CURRENT_DATE + INTERVAL '11 months', CURRENT_DATE + INTERVAL '1 year'
),
(
  (SELECT id FROM vendors WHERE business_name = 'Lagos Car Rentals' LIMIT 1),
  'Honda', 'Pilot', 2022, 'Gray', 'LAG-987-PQR', 'JH4KC1F59NC123456',
  'automatic', 'petrol', 3.5, 8, 4, true,
  32000, 192000, 750000, 100000,
  true, true, 14000,
  'Lekki', 'Lagos', 'Lagos', 'Nigeria',
  ARRAY['Lekki', 'Ajah', 'Victoria Island'], 15000, 'excellent',
  ARRAY['GPS', 'Bluetooth', 'Third Row Seating', 'Backup Camera', 'Lane Assist'],
  '/placeholder.svg?height=300&width=400',
  ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
  'active', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
  CURRENT_DATE + INTERVAL '9 months', CURRENT_DATE + INTERVAL '1 year'
),

-- Luxury Cars
(
  (SELECT id FROM vendors WHERE business_name = 'Kano Executive Cars' LIMIT 1),
  'Mercedes-Benz', 'E-Class', 2023, 'Black', 'KN-111-STU', 'WDDZF4KB1NA123456',
  'automatic', 'petrol', 2.0, 5, 4, true,
  45000, 270000, 1050000, 150000,
  false, true, 20000,
  'Nassarawa GRA', 'Kano', 'Kano', 'Nigeria',
  ARRAY['Nassarawa GRA', 'Fagge', 'Sabon Gari'], 5000, 'excellent',
  ARRAY['GPS', 'Bluetooth', 'Leather Seats', 'Panoramic Sunroof', 'Premium Sound', 'Massage Seats'],
  '/placeholder.svg?height=300&width=400',
  ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
  'active', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
  CURRENT_DATE + INTERVAL '12 months', CURRENT_DATE + INTERVAL '1 year'
),
(
  (SELECT id FROM vendors WHERE business_name = 'Abuja Premium Cars' LIMIT 1),
  'BMW', '5 Series', 2022, 'White', 'ABJ-222-VWX', 'WBAJA7C50HCJ12345',
  'automatic', 'petrol', 2.0, 5, 4, true,
  42000, 252000, 980000, 140000,
  false, true, 18000,
  'Asokoro', 'Abuja', 'FCT', 'Nigeria',
  ARRAY['Asokoro', 'Maitama', 'Wuse'], 8000, 'excellent',
  ARRAY['GPS', 'Bluetooth', 'Leather Seats', 'Adaptive Cruise Control', 'Lane Assist'],
  '/placeholder.svg?height=300&width=400',
  ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
  'active', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
  CURRENT_DATE + INTERVAL '10 months', CURRENT_DATE + INTERVAL '1 year'
);

-- Map cars to categories
INSERT INTO car_category_mappings (car_id, category_id)
SELECT 
  c.id,
  cat.id
FROM cars c
CROSS JOIN car_categories cat
WHERE 
  (c.make = 'Toyota' AND c.model = 'Corolla' AND cat.name = 'Economy') OR
  (c.make = 'Honda' AND c.model = 'Civic' AND cat.name = 'Compact') OR
  (c.make = 'Toyota' AND c.model = 'Camry' AND cat.name = 'Mid-size') OR
  (c.make = 'Nissan' AND c.model = 'Altima' AND cat.name = 'Mid-size') OR
  (c.make = 'Toyota' AND c.model = 'Highlander' AND cat.name = 'SUV') OR
  (c.make = 'Honda' AND c.model = 'Pilot' AND cat.name = 'SUV') OR
  (c.make = 'Mercedes-Benz' AND c.model = 'E-Class' AND cat.name = 'Luxury') OR
  (c.make = 'BMW' AND c.model = '5 Series' AND cat.name = 'Luxury');

-- Insert sample availability data (next 30 days available for all cars)
INSERT INTO car_availability (car_id, date, is_available)
SELECT 
  c.id,
  generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day')::date,
  true
FROM cars c;

-- Insert sample maintenance records
INSERT INTO car_maintenance (car_id, maintenance_type, description, cost, maintenance_date, next_maintenance_date, performed_by)
SELECT 
  id,
  'Oil Change',
  'Regular oil change and filter replacement',
  15000,
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '90 days',
  'AutoCare Services'
FROM cars
WHERE make IN ('Toyota', 'Honda');

-- Insert sample insurance records
INSERT INTO car_insurance (car_id, insurance_company, policy_number, coverage_type, premium_amount, start_date, end_date, is_active)
SELECT 
  id,
  'AIICO Insurance',
  'POL-' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
  'Comprehensive',
  250000,
  CURRENT_DATE - INTERVAL '6 months',
  CURRENT_DATE + INTERVAL '6 months',
  true
FROM cars;
