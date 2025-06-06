import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://fkeqqlloklmxenrikcdl.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZXFxbGxva2xteGVucmlrY2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTg0MDgsImV4cCI6MjA2NDc3NDQwOH0.RLU_Et3ZS5Vj4faoWwzuIfgT7ry2TdXUKw9VS3HksiQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error)
  return {
    success: false,
    error: error.message || "An unexpected error occurred",
  }
}

// Helper function for authenticated requests
export const getAuthenticatedUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error("Auth error:", error)
    return null
  }
  return user
}

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  wallet_balance: number
  reward_points: number
  referral_code: string
  referred_by?: string
  created_at: string
}

export interface Vendor {
  id: string
  business_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  status: "pending" | "approved" | "rejected" | "suspended"
  rating: number
  total_bookings: number
  created_at: string
}

export interface Car {
  id: string
  vendor_id: string
  name: string
  brand: string
  model: string
  year: number
  price_per_day: number
  transmission: "automatic" | "manual"
  fuel_type: string
  seats: number
  features: string[]
  images: string[]
  location: string
  address: string
  status: "active" | "maintenance" | "booked"
  rating: number
  total_bookings: number
  is_available: boolean
  created_at: string
  vendors?: {
    business_name: string
    rating: number
  }
}

export interface Driver {
  id: string
  vendor_id: string
  first_name: string
  last_name: string
  phone: string
  email?: string
  license_number: string
  experience_years: number
  rating: number
  status: "available" | "busy" | "offline"
  hourly_rate: number
  is_available: boolean
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  car_id: string
  driver_id?: string
  pickup_date: string
  return_date: string
  pickup_location: string
  return_location: string
  total_amount: number
  discount_amount: number
  service_fee: number
  driver_fee: number
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_reference: string
  with_driver: boolean
  created_at: string
  cars?: Car
  drivers?: Driver
}

export interface Review {
  id: string
  booking_id: string
  user_id: string
  car_id: string
  driver_id?: string
  rating: number
  comment: string
  created_at: string
  cars?: Car
  drivers?: Driver
  bookings?: Booking
}

export interface Discount {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  min_amount: number
  max_discount: number
  usage_limit: number
  used_count: number
  valid_from: string
  valid_until: string
  status: "active" | "inactive"
}

export interface WalletTransaction {
  id: string
  user_id: string
  type: "credit" | "debit"
  amount: number
  description: string
  reference: string
  status: "pending" | "completed" | "failed"
  created_at: string
}

export interface RewardTransaction {
  id: string
  user_id: string
  type: "earned" | "redeemed"
  points: number
  description: string
  booking_id?: string
  created_at: string
}
