"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  Car,
  CreditCard,
  Star,
  Gift,
  UserPlus,
  Settings,
  Calendar,
  MapPin,
  Phone,
  Eye,
  Download,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface UserBooking {
  id: string
  booking_reference: string
  car_id: string
  pickup_date: string
  return_date: string
  pickup_location: string
  total_amount: number
  status: string
  payment_status: string
  with_driver: boolean
  cars: {
    make: string
    model: string
    year: number
    primary_image_url: string
    vendors: {
      business_name: string
    }
  }
  drivers?: {
    first_name: string
    last_name: string
    phone: string
    rating: number
  }
}

interface WalletTransaction {
  id: string
  type: string
  amount: number
  description: string
  status: string
  created_at: string
}

interface RewardTransaction {
  id: string
  type: string
  points: number
  description: string
  created_at: string
}

export default function UserDashboard() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([])
  const [rewardTransactions, setRewardTransactions] = useState<RewardTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !profile) {
      router.push("/auth/login")
      return
    }

    const fetchUserData = async () => {
      try {
        // Fetch user bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            id,
            booking_reference,
            car_id,
            pickup_date,
            return_date,
            pickup_location,
            total_amount,
            status,
            payment_status,
            with_driver,
            cars (
              make,
              model,
              year,
              primary_image_url,
              vendors (
                business_name
              )
            ),
            drivers (
              first_name,
              last_name,
              phone,
              rating
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (bookingsError) throw bookingsError

        // Fetch wallet transactions
        const { data: walletData, error: walletError } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (walletError) throw walletError

        // Fetch reward transactions
        const { data: rewardData, error: rewardError } = await supabase
          .from("reward_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (rewardError) throw rewardError

        setBookings(bookingsData || [])
        setWalletTransactions(walletData || [])
        setRewardTransactions(rewardData || [])
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, profile, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "active":
        return <Car className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <Car className="h-6 w-6 mr-2" />
              QADA.ng
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-blue-800" asChild>
                <Link href="/search">Find Cars</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:bg-blue-800" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.profile_image || "/placeholder-user.jpg"} alt={profile.first_name} />
                    <AvatarFallback className="text-lg">
                      {profile.first_name?.[0]}
                      {profile.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-gray-500 text-sm">{profile.email}</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">Customer</Badge>

                  {/* Quick Stats */}
                  <div className="w-full mt-4 space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-600">Wallet Balance</span>
                      <span className="font-bold text-green-600">₦{profile.wallet_balance?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="text-sm text-gray-600">Reward Points</span>
                      <span className="font-bold text-purple-600">{profile.reward_points || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm text-gray-600">Total Bookings</span>
                      <span className="font-bold text-blue-600">{bookings.length}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/dashboard">
                      <Car className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/profile">
                      <Settings className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/wallet">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Wallet & Payments
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/bookings">
                      <Calendar className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/reviews">
                      <Star className="h-4 w-4 mr-2" />
                      Reviews & Ratings
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/rewards">
                      <Gift className="h-4 w-4 mr-2" />
                      Rewards Program
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/referrals">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Refer Friends
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Welcome back, {profile.first_name}!</h1>
              <p className="text-gray-600">Here's what's happening with your account</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button className="h-20 flex-col space-y-2 bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/search">
                  <Car className="h-6 w-6" />
                  <span>Book a Car</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/wallet">
                  <CreditCard className="h-6 w-6" />
                  <span>Add Money</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/support">
                  <Phone className="h-6 w-6" />
                  <span>Get Support</span>
                </Link>
              </Button>
            </div>

            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
                <TabsTrigger value="wallet">Wallet Activity</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Bookings</CardTitle>
                      <CardDescription>Your latest car rental bookings</CardDescription>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/bookings">View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">No bookings yet</p>
                        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href="/search">
                            <Plus className="h-4 w-4 mr-2" />
                            Book Your First Car
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start space-x-4">
                              <Image
                                src={booking.cars.primary_image_url || "/placeholder.svg?height=80&width=120"}
                                alt={`${booking.cars.make} ${booking.cars.model}`}
                                width={120}
                                height={80}
                                className="rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold">
                                      {booking.cars.make} {booking.cars.model} ({booking.cars.year})
                                    </h3>
                                    <p className="text-sm text-gray-500">{booking.cars.vendors.business_name}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      <MapPin className="h-3 w-3 inline mr-1" />
                                      {booking.pickup_location}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <Calendar className="h-3 w-3 inline mr-1" />
                                      {new Date(booking.pickup_date).toLocaleDateString()} -{" "}
                                      {new Date(booking.return_date).toLocaleDateString()}
                                    </p>
                                    {booking.with_driver && booking.drivers && (
                                      <p className="text-sm text-blue-600">
                                        Driver: {booking.drivers.first_name} {booking.drivers.last_name}
                                        <Star className="h-3 w-3 inline ml-1" />
                                        {booking.drivers.rating}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg">₦{booking.total_amount.toLocaleString()}</p>
                                    <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                                      {getStatusIcon(booking.status)}
                                      {booking.status}
                                    </Badge>
                                    <p className="text-xs text-gray-500 mt-1">#{booking.booking_reference}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2 mt-3">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/bookings/${booking.id}`}>
                                      <Eye className="h-3 w-3 mr-1" />
                                      View Details
                                    </Link>
                                  </Button>
                                  {booking.status === "completed" && (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`/reviews/create?booking=${booking.id}`}>
                                        <Star className="h-3 w-3 mr-1" />
                                        Write Review
                                      </Link>
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm">
                                    <Download className="h-3 w-3 mr-1" />
                                    Receipt
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wallet" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Activity</CardTitle>
                    <CardDescription>Your recent wallet transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading transactions...</div>
                    ) : walletTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {walletTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-full ${
                                  transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                                }`}
                              >
                                <CreditCard
                                  className={`h-4 w-4 ${
                                    transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(transaction.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold ${
                                  transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                              </p>
                              <Badge
                                className={
                                  transaction.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rewards Program</CardTitle>
                    <CardDescription>Track your points and rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress to next reward</span>
                        <span className="text-sm text-gray-500">{profile.reward_points || 0} / 1000 points</span>
                      </div>
                      <Progress value={((profile.reward_points || 0) / 1000) * 100} className="h-2" />
                    </div>

                    {loading ? (
                      <div className="text-center py-8">Loading rewards...</div>
                    ) : rewardTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <Gift className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No reward activity yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {rewardTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-full ${
                                  transaction.type === "earned" ? "bg-purple-100" : "bg-orange-100"
                                }`}
                              >
                                <Gift
                                  className={`h-4 w-4 ${
                                    transaction.type === "earned" ? "text-purple-600" : "text-orange-600"
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(transaction.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold ${
                                  transaction.type === "earned" ? "text-purple-600" : "text-orange-600"
                                }`}
                              >
                                {transaction.type === "earned" ? "+" : "-"}
                                {transaction.points} points
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
