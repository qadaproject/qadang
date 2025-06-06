import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://fkeqqlloklmxenrikcdl.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZXFxbGxva2xteGVucmlrY2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTg0MDgsImV4cCI6MjA2NDc3NDQwOH0.RLU_Et3ZS5Vj4faoWwzuIfgT7ry2TdXUKw9VS3HksiQ"

// Get the base URL for redirects
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Browser environment
    return window.location.origin
  }

  // Server environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Fallback for development
  return "http://localhost:3000"
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: `${getBaseUrl()}/auth/callback`,
  },
})

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

// Email verification functions
export const sendVerificationEmail = async (email: string, userType: "customer" | "vendor" | "admin") => {
  try {
    const baseUrl = getBaseUrl()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${baseUrl}/auth/verify-email?type=${userType}`,
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Password reset with proper redirect
export const sendPasswordResetEmail = async (email: string) => {
  try {
    const baseUrl = getBaseUrl()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/reset-password`,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Database types (updated with new fields)
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  wallet_balance: number
  reward_points: number
  referral_code: string
  referred_by?: string
  email_verified: boolean
  email_verified_at?: string
  verification_token?: string
  verification_token_expires?: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  business_name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  status: "pending" | "approved" | "rejected" | "suspended"
  rating: number
  total_bookings: number
  email_verified: boolean
  email_verified_at?: string
  verification_token?: string
  verification_token_expires?: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: string
  password_hash?: string
  password_reset_token?: string
  password_reset_expires?: string
  two_factor_enabled: boolean
  two_factor_secret?: string
  backup_codes?: string[]
  last_login?: string
  login_attempts: number
  locked_until?: string
  email_verified: boolean
  email_verified_at?: string
  created_at: string
  updated_at: string
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

export interface EmailVerificationToken {
  id: string
  user_id: string
  user_type: "customer" | "vendor" | "admin"
  token: string
  expires_at: string
  used_at?: string
  created_at: string
}

export interface PasswordResetToken {
  id: string
  user_id: string
  user_type: "customer" | "vendor" | "admin"
  token: string
  expires_at: string
  used_at?: string
  created_at: string
}

export interface TwoFactorAuth {
  id: string
  user_id: string
  user_type: "customer" | "vendor" | "admin"
  secret: string
  backup_codes: string[]
  enabled_at?: string
  last_used?: string
  created_at: string
}
