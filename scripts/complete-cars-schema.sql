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

-- Create car categories table
CREATE TABLE IF NOT EXISTS car_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS trigger_cars_updated_at ON cars;
CREATE TRIGGER trigger_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
