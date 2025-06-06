-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table first (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
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
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_bookings INTEGER DEFAULT 0,
  total_cars INTEGER DEFAULT 0,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  verification_token VARCHAR(100),
  verification_token_expires TIMESTAMP WITH TIME ZONE,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin',
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
CREATE TABLE IF NOT EXISTS car_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table with all necessary columns
CREATE TABLE IF NOT EXISTS cars (
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
  pickup_locations TEXT[], -- Array of pickup locations
  
  -- Car condition and features
  mileage INTEGER DEFAULT 0,
  condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair')) DEFAULT 'good',
  features TEXT[], -- Array of features like 'GPS', 'Bluetooth', 'USB', etc.
  
  -- Images and media
  primary_image_url TEXT,
  image_urls TEXT[], -- Array of image URLs
  
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
CREATE TABLE IF NOT EXISTS car_category_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES car_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(car_id, category_id)
);

-- Create car availability table for detailed scheduling
CREATE TABLE IF NOT EXISTS car_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  reason VARCHAR(100), -- 'booked', 'maintenance', 'unavailable'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(car_id, date)
);

-- Create car maintenance records table
CREATE TABLE IF NOT EXISTS car_maintenance (
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
CREATE TABLE IF NOT EXISTS car_insurance (
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

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
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

-- Create driver availability table
CREATE TABLE IF NOT EXISTS driver_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  reason VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(driver_id, date)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
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
  with_driver BOOLEAN DEFAULT FALSE,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
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
CREATE TABLE IF NOT EXISTS discounts (
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
CREATE TABLE IF NOT EXISTS wallet_transactions (
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
CREATE TABLE IF NOT EXISTS reward_transactions (
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
CREATE TABLE IF NOT EXISTS email_verification_tokens (
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
CREATE TABLE IF NOT EXISTS password_reset_tokens (
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
CREATE TABLE IF NOT EXISTS two_factor_auth (
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
('Hybrid', 'Fuel-efficient hybrid vehicles', 'leaf')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_vendor_id ON cars(vendor_id);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location);
CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_is_available ON cars(is_available);
CREATE INDEX IF NOT EXISTS idx_cars_daily_rate ON cars(daily_rate);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_transmission ON cars(transmission);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_seats ON cars(seats);
CREATE INDEX IF NOT EXISTS idx_cars_average_rating ON cars(average_rating);
CREATE INDEX IF NOT EXISTS idx_car_availability_car_date ON car_availability(car_id, date);
CREATE INDEX IF NOT EXISTS idx_car_availability_date ON car_availability(date);
CREATE INDEX IF NOT EXISTS idx_car_category_mappings_car_id ON car_category_mappings(car_id);
CREATE INDEX IF NOT EXISTS idx_car_category_mappings_category_id ON car_category_mappings(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(pickup_date, return_date);
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_driver_id ON reviews(driver_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_transactions_user_id ON reward_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_vendor_id ON drivers(vendor_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);

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
DROP TRIGGER IF EXISTS trigger_update_car_rating ON reviews;
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
DROP TRIGGER IF EXISTS trigger_update_driver_rating ON reviews;
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
DROP TRIGGER IF EXISTS trigger_update_car_bookings ON bookings;
CREATE TRIGGER trigger_update_car_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_car_bookings();

-- Create function to update vendor booking count
CREATE OR REPLACE FUNCTION update_vendor_bookings()
RETURNS TRIGGER AS $$
DECLARE
  v_vendor_id UUID;
BEGIN
  -- Get the vendor_id from the car
  SELECT vendor_id INTO v_vendor_id
  FROM cars
  WHERE id = COALESCE(NEW.car_id, OLD.car_id);
  
  -- Update the vendor's total_bookings
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
      updated_at = NOW()
    WHERE id = v_vendor_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vendor booking count
DROP TRIGGER IF EXISTS trigger_update_vendor_bookings ON bookings;
CREATE TRIGGER trigger_update_vendor_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_bookings();

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
DROP TRIGGER IF EXISTS trigger_update_vendor_cars ON cars;
CREATE TRIGGER trigger_update_vendor_cars
  AFTER INSERT OR UPDATE OR DELETE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_cars();

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_vendors_updated_at ON vendors;
CREATE TRIGGER trigger_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_admins_updated_at ON admins;
CREATE TRIGGER trigger_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_cars_updated_at ON cars;
CREATE TRIGGER trigger_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_drivers_updated_at ON drivers;
CREATE TRIGGER trigger_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_bookings_updated_at ON bookings;
CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON reviews;
CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check car availability
CREATE OR REPLACE FUNCTION check_car_availability(
  p_car_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
) RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  -- Check for existing bookings that overlap with the requested dates
  SELECT COUNT(*)
  INTO conflict_count
  FROM bookings
  WHERE car_id = p_car_id
  AND status IN ('confirmed', 'active')
  AND (
      (pickup_date <= p_end_date AND return_date >= p_start_date)
  );
  
  -- Check for manual availability blocks
  SELECT COUNT(*) + conflict_count
  INTO conflict_count
  FROM car_availability
  WHERE car_id = p_car_id
  AND is_available = false
  AND (
      (date >= p_start_date::DATE AND date <= p_end_date::DATE)
  );
  
  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Create function to check driver availability
CREATE OR REPLACE FUNCTION check_driver_availability(
  p_driver_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
) RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  -- Check for existing bookings that overlap with the requested dates
  SELECT COUNT(*)
  INTO conflict_count
  FROM bookings
  WHERE driver_id = p_driver_id
  AND status IN ('confirmed', 'active')
  AND (
      (pickup_date <= p_end_date AND return_date >= p_start_date)
  );
  
  -- Check for manual availability blocks
  SELECT COUNT(*) + conflict_count
  INTO conflict_count
  FROM driver_availability
  WHERE driver_id = p_driver_id
  AND is_available = false
  AND (
      (date >= p_start_date::DATE AND date <= p_end_date::DATE)
  );
  
  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Create function to update car availability when booking is made
CREATE OR REPLACE FUNCTION update_car_availability_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  current_date DATE := NEW.pickup_date::DATE;
BEGIN
  -- Only proceed for confirmed or active bookings
  IF NEW.status IN ('confirmed', 'active') THEN
    -- Loop through each day of the booking
    WHILE current_date <= NEW.return_date::DATE LOOP
      -- Insert or update car availability
      INSERT INTO car_availability (car_id, date, is_available, reason)
      VALUES (NEW.car_id, current_date, FALSE, 'booked')
      ON CONFLICT (car_id, date) 
      DO UPDATE SET is_available = FALSE, reason = 'booked';
      
      -- Move to next day
      current_date := current_date + INTERVAL '1 day';
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update car availability on booking
DROP TRIGGER IF EXISTS trigger_update_car_availability ON bookings;
CREATE TRIGGER trigger_update_car_availability
  AFTER INSERT OR UPDATE OF status, pickup_date, return_date ON bookings
  FOR EACH ROW
  WHEN (NEW.status IN ('confirmed', 'active'))
  EXECUTE FUNCTION update_car_availability_on_booking();

-- Create function to update driver availability when booking is made
CREATE OR REPLACE FUNCTION update_driver_availability_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  current_date DATE := NEW.pickup_date::DATE;
BEGIN
  -- Only proceed for confirmed or active bookings with a driver
  IF NEW.status IN ('confirmed', 'active') AND NEW.driver_id IS NOT NULL THEN
    -- Loop through each day of the booking
    WHILE current_date <= NEW.return_date::DATE LOOP
      -- Insert or update driver availability
      INSERT INTO driver_availability (driver_id, date, is_available, reason)
      VALUES (NEW.driver_id, current_date, FALSE, 'booked')
      ON CONFLICT (driver_id, date) 
      DO UPDATE SET is_available = FALSE, reason = 'booked';
      
      -- Move to next day
      current_date := current_date + INTERVAL '1 day';
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update driver availability on booking
DROP TRIGGER IF EXISTS trigger_update_driver_availability ON bookings;
CREATE TRIGGER trigger_update_driver_availability
  AFTER INSERT OR UPDATE OF status, pickup_date, return_date, driver_id ON bookings
  FOR EACH ROW
  WHEN (NEW.status IN ('confirmed', 'active') AND NEW.driver_id IS NOT NULL)
  EXECUTE FUNCTION update_driver_availability_on_booking();

-- Create function to free up car availability when booking is cancelled
CREATE OR REPLACE FUNCTION free_car_availability_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed when status changes to cancelled
  IF NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'active') THEN
    -- Delete availability blocks for this booking
    DELETE FROM car_availability
    WHERE car_id = NEW.car_id
    AND date >= NEW.pickup_date::DATE
    AND date <= NEW.return_date::DATE
    AND reason = 'booked';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to free up car availability on cancel
DROP TRIGGER IF EXISTS trigger_free_car_availability ON bookings;
CREATE TRIGGER trigger_free_car_availability
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'active'))
  EXECUTE FUNCTION free_car_availability_on_cancel();

-- Create function to free up driver availability when booking is cancelled
CREATE OR REPLACE FUNCTION free_driver_availability_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed when status changes to cancelled and there was a driver
  IF NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'active') AND OLD.driver_id IS NOT NULL THEN
    -- Delete availability blocks for this booking
    DELETE FROM driver_availability
    WHERE driver_id = OLD.driver_id
    AND date >= NEW.pickup_date::DATE
    AND date <= NEW.return_date::DATE
    AND reason = 'booked';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to free up driver availability on cancel
DROP TRIGGER IF EXISTS trigger_free_driver_availability ON bookings;
CREATE TRIGGER trigger_free_driver_availability
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'active') AND OLD.driver_id IS NOT NULL)
  EXECUTE FUNCTION free_driver_availability_on_cancel();
