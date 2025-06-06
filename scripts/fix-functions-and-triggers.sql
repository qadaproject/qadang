-- Fix missing functions and triggers

-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS trigger_update_driver_availability ON bookings;
DROP TRIGGER IF EXISTS trigger_update_car_availability ON bookings;
DROP TRIGGER IF EXISTS trigger_free_driver_availability ON bookings;
DROP TRIGGER IF EXISTS trigger_free_car_availability ON bookings;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_driver_availability_on_booking();
DROP FUNCTION IF EXISTS update_car_availability_on_booking();
DROP FUNCTION IF EXISTS free_driver_availability_on_cancel();
DROP FUNCTION IF EXISTS free_car_availability_on_cancel();

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

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Now create all the triggers

-- Trigger to update car availability on booking
CREATE TRIGGER trigger_update_car_availability
  AFTER INSERT OR UPDATE OF status, pickup_date, return_date ON bookings
  FOR EACH ROW
  WHEN (NEW.status IN ('confirmed', 'active'))
  EXECUTE FUNCTION update_car_availability_on_booking();

-- Trigger to update driver availability on booking
CREATE TRIGGER trigger_update_driver_availability
  AFTER INSERT OR UPDATE OF status, pickup_date, return_date, driver_id ON bookings
  FOR EACH ROW
  WHEN (NEW.status IN ('confirmed', 'active') AND NEW.driver_id IS NOT NULL)
  EXECUTE FUNCTION update_driver_availability_on_booking();

-- Trigger to free up car availability on cancel
CREATE TRIGGER trigger_free_car_availability
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'active'))
  EXECUTE FUNCTION free_car_availability_on_cancel();

-- Trigger to free up driver availability on cancel
CREATE TRIGGER trigger_free_driver_availability
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'active') AND OLD.driver_id IS NOT NULL)
  EXECUTE FUNCTION free_driver_availability_on_cancel();

-- Trigger to automatically update car ratings
DROP TRIGGER IF EXISTS trigger_update_car_rating ON reviews;
CREATE TRIGGER trigger_update_car_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_car_rating();

-- Trigger to automatically update driver ratings
DROP TRIGGER IF EXISTS trigger_update_driver_rating ON reviews;
CREATE TRIGGER trigger_update_driver_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_rating();

-- Trigger to automatically update car booking count
DROP TRIGGER IF EXISTS trigger_update_car_bookings ON bookings;
CREATE TRIGGER trigger_update_car_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_car_bookings();

-- Trigger to automatically update vendor booking count
DROP TRIGGER IF EXISTS trigger_update_vendor_bookings ON bookings;
CREATE TRIGGER trigger_update_vendor_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_bookings();

-- Trigger to automatically update vendor car count
DROP TRIGGER IF EXISTS trigger_update_vendor_cars ON cars;
CREATE TRIGGER trigger_update_vendor_cars
  AFTER INSERT OR UPDATE OR DELETE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_cars();

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

-- Add some sample data for testing
INSERT INTO users (email, first_name, last_name, phone, wallet_balance, reward_points, email_verified) VALUES
('john.doe@example.com', 'John', 'Doe', '+2348012345678', 50000.00, 150, true),
('jane.smith@example.com', 'Jane', 'Smith', '+2348087654321', 25000.00, 75, true),
('mike.johnson@example.com', 'Mike', 'Johnson', '+2348098765432', 75000.00, 200, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO vendors (business_name, email, phone, address, city, state, status, rating, email_verified) VALUES
('Lagos Car Rentals', 'info@lagoscarrentals.com', '+2348011111111', '123 Victoria Island', 'Lagos', 'Lagos', 'approved', 4.5, true),
('Abuja Premium Cars', 'contact@abujacarrentals.com', '+2348022222222', '456 Wuse 2', 'Abuja', 'FCT', 'approved', 4.2, true),
('Port Harcourt Wheels', 'hello@phwheels.com', '+2348033333333', '789 GRA', 'Port Harcourt', 'Rivers', 'approved', 4.7, true)
ON CONFLICT (email) DO NOTHING;

-- Get vendor IDs for car insertion
DO $$
DECLARE
    vendor1_id UUID;
    vendor2_id UUID;
    vendor3_id UUID;
BEGIN
    SELECT id INTO vendor1_id FROM vendors WHERE email = 'info@lagoscarrentals.com';
    SELECT id INTO vendor2_id FROM vendors WHERE email = 'contact@abujacarrentals.com';
    SELECT id INTO vendor3_id FROM vendors WHERE email = 'hello@phwheels.com';

    -- Insert sample cars
    INSERT INTO cars (
        vendor_id, make, model, year, color, license_plate, vin,
        transmission, fuel_type, seats, doors, daily_rate, weekly_rate, monthly_rate,
        location, city, state, status, is_available, features,
        primary_image_url, image_urls, gallery_images, exterior_images, interior_images
    ) VALUES
    (vendor1_id, 'Toyota', 'Corolla', 2022, 'White', 'LAG-123-ABC', 'JT2BF28K123456789',
     'automatic', 'petrol', 5, 4, 15000.00, 90000.00, 350000.00,
     'Victoria Island', 'Lagos', 'Lagos', 'active', true,
     ARRAY['Air Conditioning', 'Bluetooth', 'USB Ports', 'GPS'],
     '/placeholder.svg?height=300&width=400',
     ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400']),
    
    (vendor1_id, 'Honda', 'Civic', 2023, 'Black', 'LAG-456-DEF', 'JH4KA7561MC123456',
     'automatic', 'petrol', 5, 4, 18000.00, 108000.00, 420000.00,
     'Ikeja', 'Lagos', 'Lagos', 'active', true,
     ARRAY['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Sunroof'],
     '/placeholder.svg?height=300&width=400',
     ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400']),
    
    (vendor2_id, 'Mercedes-Benz', 'E-Class', 2023, 'Silver', 'ABJ-789-GHI', 'WDB2124561A123456',
     'automatic', 'petrol', 5, 4, 45000.00, 270000.00, 1050000.00,
     'Wuse 2', 'Abuja', 'FCT', 'active', true,
     ARRAY['Leather Seats', 'Premium Sound', 'Navigation', 'Heated Seats'],
     '/placeholder.svg?height=300&width=400',
     ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400']),
    
    (vendor3_id, 'Toyota', 'Highlander', 2022, 'Blue', 'PHC-012-JKL', 'JTEEUGBF1MA123456',
     'automatic', 'petrol', 8, 4, 35000.00, 210000.00, 820000.00,
     'GRA', 'Port Harcourt', 'Rivers', 'active', true,
     ARRAY['Third Row Seating', 'All-Wheel Drive', 'Towing Package', 'Entertainment System'],
     '/placeholder.svg?height=300&width=400',
     ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400'],
     ARRAY['/placeholder.svg?height=300&width=400'])
    ON CONFLICT (license_plate) DO NOTHING;

END $$;
