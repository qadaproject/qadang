-- Add missing columns to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS business_logo TEXT,
ADD COLUMN IF NOT EXISTS business_description TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}';

-- Add comprehensive media columns to cars table
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS video_urls TEXT[], -- Array of video URLs
ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT, -- 360° virtual tour
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT, -- Thumbnail for listings
ADD COLUMN IF NOT EXISTS gallery_images TEXT[], -- Additional gallery images
ADD COLUMN IF NOT EXISTS interior_images TEXT[], -- Interior photos
ADD COLUMN IF NOT EXISTS exterior_images TEXT[], -- Exterior photos
ADD COLUMN IF NOT EXISTS document_images TEXT[]; -- Registration, insurance docs

-- Add profile image to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);

-- Add profile image to drivers table
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS license_image TEXT,
ADD COLUMN IF NOT EXISTS background_check_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS background_check_date DATE,
ADD COLUMN IF NOT EXISTS languages_spoken TEXT[],
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add more detailed booking information
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS customer_notes TEXT,
ADD COLUMN IF NOT EXISTS vendor_notes TEXT,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS cancellation_fee DECIMAL(10,2) DEFAULT 0.00;

-- Create a function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference = 'QAD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('booking_ref_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for booking references
CREATE SEQUENCE IF NOT EXISTS booking_ref_seq START 1;

-- Create trigger for booking reference generation
DROP TRIGGER IF EXISTS trigger_generate_booking_reference ON bookings;
CREATE TRIGGER trigger_generate_booking_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_reference();

-- Update existing bookings with references if they don't have them
UPDATE bookings 
SET booking_reference = 'QAD' || TO_CHAR(created_at, 'YYYYMMDD') || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 4, '0')
WHERE booking_reference IS NULL;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_cars_thumbnail_url ON cars(thumbnail_url);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_users_city_state ON users(city, state);
CREATE INDEX IF NOT EXISTS idx_vendors_city_state ON vendors(city, state);
