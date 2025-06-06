"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, CreditCard, Package, Wallet, Gift, Car, Phone, Mail, LogOut } from "lucide-react"
import Link from "next/link"
import { LoadingAnimation } from "@/components/ui/loading-animation"

export default function UserDashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingAnimation text="Loading your dashboard..." />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your dashboard.</p>
          <Link href="/auth/login">
            <Button className="mt-4">Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getUserInitials = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    }
    if (profile.email) {
      return profile.email[0].toUpperCase()
    }
    return "U"
  }

  const getDisplayName = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    if (profile.first_name) {
      return profile.first_name
    }
    return profile.email.split("@")[0]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                QADA.ng
              </Link>
              <Badge variant="secondary">Customer Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.profile_image || ""} alt={getDisplayName()} />
                <AvatarFallback className="bg-blue-500 text-white">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{getDisplayName()}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {getDisplayName()}!</h1>
          <p className="text-gray-600 mt-2">Manage your bookings, wallet, and profile from your dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Information</CardTitle>
              <User className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.profile_image || ""} alt={getDisplayName()} />
                  <AvatarFallback className="bg-blue-500 text-white text-lg">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{getDisplayName()}</h3>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                  {profile.phone && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {profile.phone}
                    </p>
                  )}
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦{(profile.wallet_balance || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Available balance</p>
              <Separator className="my-4" />
              <div className="flex space-x-2">
                <Link href="/wallet" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Add Money
                  </Button>
                </Link>
                <Link href="/wallet/history" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Reward Points Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
              <Gift className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{profile.reward_points || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Points earned</p>
              <Separator className="my-4" />
              <Link href="/rewards">
                <Button variant="outline" size="sm" className="w-full">
                  Redeem Points
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/search">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Car className="h-6 w-6 mb-2" />
                    <span className="text-sm">Book a Car</span>
                  </Button>
                </Link>
                <Link href="/bookings">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Package className="h-6 w-6 mb-2" />
                    <span className="text-sm">My Bookings</span>
                  </Button>
                </Link>
                <Link href="/wallet">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <CreditCard className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add Money</span>
                  </Button>
                </Link>
                <Link href="/support">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Mail className="h-6 w-6 mb-2" />
                    <span className="text-sm">Get Support</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest bookings and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Car className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">No recent bookings</p>
                    <p className="text-xs text-gray-600">Start by booking your first car rental</p>
                  </div>
                  <Link href="/search">
                    <Button size="sm">Book Now</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
