-- Complete QADA.ng Car Rental Database Schema
-- This script creates all tables in the correct order with proper relationships

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS reward_transactions CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS driver_availability CASCADE;
DROP TABLE IF EXISTS car_availability CASCADE;
DROP TABLE IF EXISTS car_maintenance CASCADE;
DROP TABLE IF EXISTS car_insurance CASCADE;
DROP TABLE IF EXISTS car_category_mappings CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS car_categories CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS two_factor_auth CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS email_verification_tokens CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Nigeria',
  profile_image TEXT,
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  reward_points INTEGER DEFAULT 0,
  referral_code VARCHAR(10) UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
  referred_by UUID REFERENCES users(id),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  verification_token VARCHAR(100),
  verification_token_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  business_description TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Nigeria',
  business_logo TEXT,
  profile_image TEXT,
  website_url TEXT,
  business_registration_number VARCHAR(100),
  tax_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_bookings INTEGER DEFAULT 0,
  total_cars INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0.00,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  verification_token VARCHAR(100),
  verification_token_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin',
  profile_image TEXT,
  password_hash TEXT,
  password_reset_token VARCHAR(100),
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  backup_codes TEXT[],
  last_login TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car categories table
CREATE TABLE car_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  license_number VARCHAR(50) NOT NULL,
  license_expiry DATE NOT NULL,
  experience_years INTEGER NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
  hourly_rate DECIMAL(10,2) NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  color VARCHAR(30),
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  vin VARCHAR(17) UNIQUE,
  
  -- Car specifications
  transmission VARCHAR(20) CHECK (transmission IN ('automatic', 'manual')) DEFAULT 'automatic',
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')) DEFAULT 'petrol',
  engine_size DECIMAL(3,1),
  seats INTEGER CHECK (seats >= 2 AND seats <= 50) DEFAULT 5,
  doors INTEGER CHECK (doors >= 2 AND doors <= 6) DEFAULT 4,
  air_conditioning BOOLEAN DEFAULT TRUE,
  
  -- Pricing
  daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate > 0),
  weekly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  security_deposit DECIMAL(10,2) DEFAULT 0,
  
  -- Driver options
  self_drive_available BOOLEAN DEFAULT TRUE,
  with_driver_available BOOLEAN DEFAULT TRUE,
  driver_daily_rate DECIMAL(10,2) DEFAULT 0,
  
  -- Location and availability
  location VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  country VARCHAR(50) DEFAULT 'Nigeria',
  pickup_locations TEXT[],
  
  -- Car condition and features
  mileage INTEGER DEFAULT 0,
  condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair')) DEFAULT 'good',
  features TEXT[],
  
  -- Images and media
  primary_image_url TEXT,
  image_urls TEXT[],
  video_urls TEXT[],
  virtual_tour_url TEXT,
  thumbnail_url TEXT,
  gallery_images TEXT[],
  interior_images TEXT[],
  exterior_images TEXT[],
  document_images TEXT[],
  
  -- Status and availability
  status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'maintenance', 'rented')) DEFAULT 'active',
  is_available BOOLEAN DEFAULT TRUE,
  availability_start DATE,
  availability_end DATE,
  
  -- Insurance and documents
  insurance_valid_until DATE,
  registration_valid_until DATE,
  last_service_date DATE,
  next_service_due DATE,
  
  -- Ratings and reviews
  average_rating DECIMAL(3,2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car_category_mappings table
CREATE TABLE car_category_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES car_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(car_id, category_id)
);

-- Create car availability table
CREATE TABLE car_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  reason VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(car_id, date)
);

-- Create driver availability table
CREATE TABLE driver_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  reason VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(driver_id, date)
);

-- Create car maintenance table
CREATE TABLE car_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(50) NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  maintenance_date DATE NOT NULL,
  next_maintenance_date DATE,
  performed_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car insurance table
CREATE TABLE car_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  insurance_company VARCHAR(100) NOT NULL,
  policy_number VARCHAR(50) NOT NULL,
  coverage_type VARCHAR(50),
  premium_amount DECIMAL(10,2),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_location TEXT NOT NULL,
  return_location TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  service_fee DECIMAL(10,2) DEFAULT 0.00,
  driver_fee DECIMAL(10,2) DEFAULT 0.00,
  insurance_fee DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference VARCHAR(100),
  booking_reference VARCHAR(20) UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 10)),
  with_driver BOOLEAN DEFAULT FALSE,
  special_requests TEXT,
  customer_notes TEXT,
  vendor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discounts table
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) DEFAULT 0.00,
  max_discount DECIMAL(10,2),
  usage_limit INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet transactions table
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward transactions table
CREATE TABLE reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'redeemed')),
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email verification tokens table
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  vendor_id UUID,
  admin_id UUID,
  token VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_one_id CHECK (
    (user_id IS NOT NULL AND vendor_id IS NULL AND admin_id IS NULL) OR
    (user_id IS NULL AND vendor_id IS NOT NULL AND admin_id IS NULL) OR
    (user_id IS NULL AND vendor_id IS NULL AND admin_id IS NOT NULL)
  ),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Create password reset tokens table
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  vendor_id UUID,
  admin_id UUID,
  token VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_one_id CHECK (
    (user_id IS NOT NULL AND vendor_id IS NULL AND admin_id IS NULL) OR
    (user_id IS NULL AND vendor_id IS NOT NULL AND admin_id IS NULL) OR
    (user_id IS NULL AND vendor_id IS NULL AND admin_id IS NOT NULL)
  ),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Create two factor auth table
CREATE TABLE two_factor_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  vendor_id UUID,
  admin_id UUID,
  secret TEXT NOT NULL,
  backup_codes TEXT[],
  enabled_at TIMESTAMP WITH TIME ZONE,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_one_id CHECK (
    (user_id IS NOT NULL AND vendor_id IS NULL AND admin_id IS NULL) OR
    (user_id IS NULL AND vendor_id IS NOT NULL AND admin_id IS NULL) OR
    (user_id IS NULL AND vendor_id IS NULL AND admin_id IS NOT NULL)
  ),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Insert default car categories
INSERT INTO car_categories (name, description, icon) VALUES
('Economy', 'Budget-friendly cars perfect for city driving', 'car'),
('Compact', 'Small cars ideal for urban navigation', 'car-front'),
('Mid-size', 'Comfortable cars for longer trips', 'car-side'),
('Full-size', 'Spacious cars for families', 'truck'),
('Luxury', 'Premium vehicles with high-end features', 'crown'),
('SUV', 'Sport Utility Vehicles for all terrains', 'mountain'),
('Van', 'Large vehicles for groups and cargo', 'bus'),
('Convertible', 'Open-top cars for scenic drives', 'sun'),
('Electric', 'Eco-friendly electric vehicles', 'zap'),
('Hybrid', 'Fuel-efficient hybrid vehicles', 'leaf');

-- Create indexes for better performance
CREATE INDEX idx_cars_vendor_id ON cars(vendor_id);
CREATE INDEX idx_cars_location ON cars(location);
CREATE INDEX idx_cars_city ON cars(city);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_is_available ON cars(is_available);
CREATE INDEX idx_cars_daily_rate ON cars(daily_rate);
CREATE INDEX idx_cars_make_model ON cars(make, model);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_transmission ON cars(transmission);
CREATE INDEX idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX idx_cars_seats ON cars(seats);
CREATE INDEX idx_cars_average_rating ON cars(average_rating);
CREATE INDEX idx_car_availability_car_date ON car_availability(car_id, date);
CREATE INDEX idx_car_availability_date ON car_availability(date);
CREATE INDEX idx_car_category_mappings_car_id ON car_category_mappings(car_id);
CREATE INDEX idx_car_category_mappings_category_id ON car_category_mappings(category_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_dates ON bookings(pickup_date, return_date);
CREATE INDEX idx_reviews_car_id ON reviews(car_id);
CREATE INDEX idx_reviews_driver_id ON reviews(driver_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_reward_transactions_user_id ON reward_transactions(user_id);
CREATE INDEX idx_drivers_vendor_id ON drivers(vendor_id);
CREATE INDEX idx_drivers_status ON drivers(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update car ratings
CREATE OR REPLACE FUNCTION update_car_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cars 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE car_id = COALESCE(NEW.car_id, OLD.car_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE car_id = COALESCE(NEW.car_id, OLD.car_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.car_id, OLD.car_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update car ratings
CREATE TRIGGER trigger_update_car_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_car_rating();

-- Create function to update driver ratings
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF COALESCE(NEW.driver_id, OLD.driver_id) IS NOT NULL THEN
    UPDATE drivers 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE driver_id = COALESCE(NEW.driver_id, OLD.driver_id)
      ),
      updated_at = NOW()
    WHERE id = COALESCE(NEW.driver_id, OLD.driver_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update driver ratings
CREATE TRIGGER trigger_update_driver_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_rating();

-- Create function to update car booking count
CREATE OR REPLACE FUNCTION update_car_bookings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cars 
  SET 
    total_bookings = (
      SELECT COUNT(*) 
      FROM bookings 
      WHERE car_id = COALESCE(NEW.car_id, OLD.car_id)
      AND status IN ('confirmed', 'completed')
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.car_id, OLD.car_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update car booking count
CREATE TRIGGER trigger_update_car_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_car_bookings();

-- Create function to update vendor statistics
CREATE OR REPLACE FUNCTION update_vendor_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_vendor_id UUID;
BEGIN
  -- Get the vendor_id from the car
  SELECT vendor_id INTO v_vendor_id
  FROM cars
  WHERE id = COALESCE(NEW.car_id, OLD.car_id);
  
  -- Update the vendor's statistics
  IF v_vendor_id IS NOT NULL THEN
    UPDATE vendors 
    SET 
      total_bookings = (
        SELECT COUNT(*) 
        FROM bookings b
        JOIN cars c ON b.car_id = c.id
        WHERE c.vendor_id = v_vendor_id
        AND b.status IN ('confirmed', 'completed')
      ),
      total_revenue = (
        SELECT COALESCE(SUM(total_amount), 0)
        FROM bookings b
        JOIN cars c ON b.car_id = c.id
        WHERE c.vendor_id = v_vendor_id
        AND b.payment_status = 'paid'
      ),
      updated_at = NOW()
    WHERE id = v_vendor_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vendor statistics
CREATE TRIGGER trigger_update_vendor_stats
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_stats();

-- Create function to update vendor car count
CREATE OR REPLACE FUNCTION update_vendor_cars()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendors 
  SET 
    total_cars = (
      SELECT COUNT(*) 
      FROM cars 
      WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
      AND status != 'inactive'
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vendor car count
CREATE TRIGGER trigger_update_vendor_cars
  AFTER INSERT OR UPDATE OR DELETE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_cars();

-- Insert sample data
INSERT INTO users (id, email, first_name, last_name, phone, wallet_balance, reward_points, profile_image) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John', 'Doe', '+2348012345678', 50000.00, 250, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'Jane', 'Smith', '+2348087654321', 75000.00, 180, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
('550e8400-e29b-41d4-a716-446655440003', 'mike.johnson@example.com', 'Mike', 'Johnson', '+2348098765432', 25000.00, 120, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face');

INSERT INTO vendors (id, business_name, business_description, email, phone, city, state, status, rating, total_bookings, total_cars, business_logo) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Lagos Premium Cars', 'Premium car rental service in Lagos with luxury and economy vehicles', 'info@lagospremiumcars.com', '+2348123456789', 'Lagos', 'Lagos', 'approved', 4.5, 150, 12, 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=100&fit=crop'),
('660e8400-e29b-41d4-a716-446655440002', 'Abuja Car Rentals', 'Reliable car rental services in the Federal Capital Territory', 'contact@abujacarrentals.com', '+2348134567890', 'Abuja', 'FCT', 'approved', 4.2, 89, 8, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=100&fit=crop'),
('660e8400-e29b-41d4-a716-446655440003', 'Port Harcourt Wheels', 'Your trusted car rental partner in Port Harcourt', 'hello@phwheels.com', '+2348145678901', 'Port Harcourt', 'Rivers', 'approved', 4.0, 67, 6, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=100&fit=crop');

INSERT INTO cars (id, vendor_id, make, model, year, color, license_plate, daily_rate, weekly_rate, monthly_rate, location, city, state, primary_image_url, image_urls, seats, transmission, fuel_type, features) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Toyota', 'Corolla', 2022, 'Silver', 'LAG-123-ABC', 15000.00, 90000.00, 350000.00, 'Victoria Island', 'Lagos', 'Lagos', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop'], 5, 'automatic', 'petrol', ARRAY['Air Conditioning', 'Bluetooth', 'USB Charging']),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Honda', 'Civic', 2023, 'Blue', 'LAG-456-DEF', 18000.00, 108000.00, 420000.00, 'Ikeja', 'Lagos', 'Lagos', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'], 5, 'automatic', 'petrol', ARRAY['Air Conditioning', 'GPS Navigation', 'Backup Camera']),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Toyota', 'Highlander', 2021, 'Black', 'ABJ-789-GHI', 35000.00, 210000.00, 800000.00, 'Wuse 2', 'Abuja', 'FCT', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', ARRAY['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&h=600&fit=crop'], 7, 'automatic', 'petrol', ARRAY['Air Conditioning', 'Leather Seats', 'Sunroof', 'GPS Navigation']),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'Mercedes-Benz', 'E-Class', 2023, 'White', 'PH-321-JKL', 50000.00, 300000.00, 1200000.00, 'GRA Phase 2', 'Port Harcourt', 'Rivers', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop'], 5, 'automatic', 'petrol', ARRAY['Premium Sound System', 'Heated Seats', 'Panoramic Sunroof', 'Advanced Safety Features']);

-- Map cars to categories
INSERT INTO car_category_mappings (car_id, category_id) 
SELECT c.id, cat.id 
FROM cars c, car_categories cat 
WHERE (c.make = 'Toyota' AND c.model = 'Corolla' AND cat.name = 'Economy')
   OR (c.make = 'Honda' AND c.model = 'Civic' AND cat.name = 'Compact')
   OR (c.make = 'Toyota' AND c.model = 'Highlander' AND cat.name = 'SUV')
   OR (c.make = 'Mercedes-Benz' AND c.model = 'E-Class' AND cat.name = 'Luxury');

-- Insert sample bookings
INSERT INTO bookings (user_id, car_id, pickup_date, return_date, pickup_location, return_location, total_amount, status, payment_status, booking_reference) VALUES
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', NOW() + INTERVAL '2 days', NOW() + INTERVAL '5 days', 'Victoria Island, Lagos', 'Victoria Island, Lagos', 45000.00, 'confirmed', 'paid', 'QADA001'),
('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', NOW() + INTERVAL '1 week', NOW() + INTERVAL '10 days', 'Wuse 2, Abuja', 'Wuse 2, Abuja', 105000.00, 'pending', 'pending', 'QADA002');

-- Insert sample reviews
INSERT INTO reviews (booking_id, user_id, car_id, rating, comment) VALUES
((SELECT id FROM bookings WHERE booking_reference = 'QADA001'), '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 5, 'Excellent car and service! Very clean and reliable.');

-- Insert sample wallet transactions
INSERT INTO wallet_transactions (user_id, type, amount, description, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'credit', 50000.00, 'Initial wallet funding', 'completed'),
('550e8400-e29b-41d4-a716-446655440002', 'credit', 75000.00, 'Wallet top-up via Paystack', 'completed'),
('550e8400-e29b-41d4-a716-446655440001', 'debit', 45000.00, 'Payment for booking QADA001', 'completed');

-- Insert sample reward transactions
INSERT INTO reward_transactions (user_id, type, points, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'earned', 250, 'Welcome bonus for new user'),
('550e8400-e29b-41d4-a716-446655440002', 'earned', 180, 'Points earned from completed booking'),
('550e8400-e29b-41d4-a716-446655440001', 'earned', 45, 'Points earned from booking QADA001');
