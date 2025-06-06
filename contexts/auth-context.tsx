"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, sendVerificationEmail, sendPasswordResetEmail } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

type UserRole = "customer" | "vendor" | "admin"

interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role: UserRole
  wallet_balance?: number
  reward_points?: number
  referral_code?: string
  business_name?: string // For vendors
  email_verified: boolean
  email_verified_at?: string
}

interface AuthContextType {
  user: SupabaseUser | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (
    email: string,
    password: string,
    userData: Partial<UserProfile>,
  ) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  resendVerification: (email: string, userType: UserRole) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      // First try to get customer profile
      const { data: customerData, error: customerError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (customerData) {
        setProfile({
          ...customerData,
          role: "customer",
        })
        return
      }

      // If not a customer, try vendor
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", userId)
        .single()

      if (vendorData) {
        setProfile({
          ...vendorData,
          role: "vendor",
        })
        return
      }

      // If not a vendor, try admin
      const { data: adminData, error: adminError } = await supabase.from("admins").select("*").eq("id", userId).single()

      if (adminData) {
        setProfile({
          ...adminData,
          role: "admin",
        })
        return
      }

      // If no profile found, create a basic one
      if (!customerData && !vendorData && !adminData) {
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          setProfile({
            id: userData.user.id,
            email: userData.user.email || "",
            role: "customer", // Default role
            email_verified: false,
          })
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        await fetchUserProfile(data.user.id)
        return { success: true }
      }

      return { success: false, error: "Unknown error occurred" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email?type=${userData.role || "customer"}&email=${encodeURIComponent(email)}`,
        },
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: "Failed to create user" }
      }

      // Determine user type and create profile
      const userId = authData.user.id
      const userRole = userData.role || "customer"

      if (userRole === "customer") {
        // Create customer profile
        const { error: profileError } = await supabase.from("users").insert({
          id: userId,
          email,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          phone: userData.phone || "",
          wallet_balance: 0,
          reward_points: 0,
          referral_code: generateReferralCode(),
          referred_by: userData.referral_code,
          email_verified: false,
        })

        if (profileError) {
          return { success: false, error: profileError.message }
        }
      } else if (userRole === "vendor") {
        // Create vendor profile
        const { error: profileError } = await supabase.from("vendors").insert({
          id: userId,
          email,
          business_name: userData.business_name || "",
          phone: userData.phone || "",
          address: "",
          city: "",
          state: "",
          status: "pending",
          rating: 0,
          total_bookings: 0,
          email_verified: false,
        })

        if (profileError) {
          return { success: false, error: profileError.message }
        }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push("/")
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    return await sendPasswordResetEmail(email)
  }

  // Resend verification function
  const resendVerification = async (email: string, userType: UserRole) => {
    return await sendVerificationEmail(email, userType)
  }

  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !profile) {
      return { success: false, error: "Not authenticated" }
    }

    try {
      const table = profile.role === "customer" ? "users" : profile.role === "vendor" ? "vendors" : "admins"

      const { error } = await supabase.from(table).update(data).eq("id", user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Update local profile state
      setProfile((prev) => (prev ? { ...prev, ...data } : null))

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Helper function to generate referral code
  const generateReferralCode = () => {
    return "QADA" + Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    resendVerification,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
