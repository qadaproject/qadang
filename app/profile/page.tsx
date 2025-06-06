"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Edit, ArrowLeft, User, Phone, Mail, MapPin, Calendar, Users, FileText } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LoadingAnimation } from "@/components/ui/loading-animation"

interface UserData {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  date_of_birth?: string
  address?: string
  city?: string
  state?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  bio?: string
  profile_image?: string
  wallet_balance?: number
  reward_points?: number
  referral_code?: string
  created_at?: string
  updated_at?: string
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user?.id) {
      fetchUserData()
    }
  }, [user, authLoading, router])

  const fetchUserData = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching user data:", error)
        return
      }

      if (data) {
        setUserData(data)
      }
    } catch (err) {
      console.error("Exception fetching user data:", err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingAnimation text="Loading profile..." />
      </div>
    )
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getDisplayName = () => {
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`
    }
    if (userData.first_name) {
      return userData.first_name
    }
    return userData.email.split("@")[0]
  }

  const getUserInitials = () => {
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase()
    }
    if (userData.email) {
      return userData.email[0].toUpperCase()
    }
    return "U"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">My Profile</h1>
                <p className="text-sm text-gray-600">View and manage your profile information</p>
              </div>
            </div>
            <Link href="/profile/edit">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userData.profile_image || "/placeholder.svg"} alt={getDisplayName()} />
                    <AvatarFallback className="text-lg bg-blue-500 text-white">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{getDisplayName()}</h2>
                  <p className="text-gray-600 mb-4">{userData.email}</p>

                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Wallet Balance</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ₦{(userData.wallet_balance || 0).toLocaleString()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reward Points</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {userData.reward_points || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Referral Code</span>
                      <Badge variant="outline">{userData.referral_code}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">First Name</label>
                      <p className="text-gray-900">{userData.first_name || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Name</label>
                      <p className="text-gray-900">{userData.last_name || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                      <p className="text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {userData.date_of_birth
                          ? new Date(userData.date_of_birth).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {userData.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {userData.bio && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center mb-2">
                          <FileText className="h-4 w-4 mr-2" />
                          Bio
                        </label>
                        <p className="text-gray-900">{userData.bio}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="text-gray-900">{userData.address || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <p className="text-gray-900">{userData.city || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">State</label>
                      <p className="text-gray-900">{userData.state || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="text-gray-900">{userData.country || "Nigeria"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              {(userData.emergency_contact_name || userData.emergency_contact_phone) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Contact Name</label>
                        <p className="text-gray-900">{userData.emergency_contact_name || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Contact Phone</label>
                        <p className="text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {userData.emergency_contact_phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email Address</label>
                      <p className="text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {userData.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Member Since</label>
                      <p className="text-gray-900">
                        {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
