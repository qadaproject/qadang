"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  Car,
  Package,
  Users,
  CreditCard,
  LogOut,
  Settings,
  PlusCircle,
  BarChart3,
  TrendingUp,
  Calendar,
  Star,
  Eye,
  Edit,
  MapPin,
  Phone,
  Globe,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VendorCar {
  id: string
  make: string
  model: string
  year: number
  daily_rate: number
  status: string
  primary_image_url: string
  total_bookings: number
  average_rating: number
  is_available: boolean
}

interface VendorBooking {
  id: string
  booking_reference: string
  car_id: string
  pickup_date: string
  return_date: string
  total_amount: number
  status: string
  payment_status: string
  cars: {
    make: string
    model: string
    year: number
  }
  users: {
    first_name: string
    last_name: string
    phone: string
    email: string
  }
}

export default function VendorDashboardPage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const [cars, setCars] = useState<VendorCar[]>([])
  const [bookings, setBookings] = useState<VendorBooking[]>([])
  const [stats, setStats] = useState({
    totalCars: 0,
    activeCars: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !profile || profile.role !== "vendor") {
      router.push("/auth/login?tab=vendor")
      return
    }

    const fetchVendorData = async () => {
      try {
        // Fetch vendor's cars
        const { data: carsData, error: carsError } = await supabase
          .from("cars")
          .select("*")
          .eq("vendor_id", user.id)
          .order("created_at", { ascending: false })

        if (carsError) throw carsError

        // Fetch vendor's bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            id,
            booking_reference,
            car_id,
            pickup_date,
            return_date,
            total_amount,
            status,
            payment_status,
            cars!inner (
              make,
              model,
              year,
              vendor_id
            ),
            users (
              first_name,
              last_name,
              phone,
              email
            )
          `)
          .eq("cars.vendor_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (bookingsError) throw bookingsError

        // Calculate stats
        const totalCars = carsData?.length || 0
        const activeCars = carsData?.filter((car) => car.status === "active").length || 0
        const totalBookings = bookingsData?.length || 0
        const activeBookings = bookingsData?.filter((booking) => booking.status === "active").length || 0
        const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

        // Calculate monthly revenue (current month)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyRevenue =
          bookingsData
            ?.filter((booking) => {
              const bookingDate = new Date(booking.pickup_date)
              return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
            })
            .reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

        const averageRating =
          carsData?.reduce((sum, car) => sum + (car.average_rating || 0), 0) / (carsData?.length || 1) || 0
        const completedBookings = bookingsData?.filter((booking) => booking.status === "completed").length || 0
        const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0

        setCars(carsData || [])
        setBookings(bookingsData || [])
        setStats({
          totalCars,
          activeCars,
          totalBookings,
          activeBookings,
          totalRevenue,
          monthlyRevenue,
          averageRating,
          completionRate,
        })
      } catch (err) {
        console.error("Error fetching vendor data:", err)
        setError("Failed to load vendor data")
      } finally {
        setLoading(false)
      }
    }

    fetchVendorData()
  }, [user, profile, router])

  const handleSignOut = async () => {
    await signOut()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <Badge className="bg-blue-700 text-white">Vendor Portal</Badge>
              <Button variant="ghost" className="text-white hover:bg-blue-800" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
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
                    <AvatarImage
                      src={profile.profile_image || "/placeholder-business.jpg"}
                      alt={profile.business_name}
                    />
                    <AvatarFallback className="text-lg">{profile.business_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{profile.business_name}</h2>
                  <p className="text-gray-500 text-sm">{profile.email}</p>
                  <Badge
                    className={`mt-2 ${
                      profile.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : profile.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile.status}
                  </Badge>

                  {/* Business Info */}
                  <div className="w-full mt-4 space-y-2 text-left">
                    {profile.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-2" />
                        {profile.phone}
                      </div>
                    )}
                    {profile.city && profile.state && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-2" />
                        {profile.city}, {profile.state}
                      </div>
                    )}
                    {profile.website_url && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-3 w-3 mr-2" />
                        <a
                          href={profile.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="w-full mt-4 space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm text-gray-600">Total Cars</span>
                      <span className="font-bold text-blue-600">{stats.totalCars}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-600">Active Cars</span>
                      <span className="font-bold text-green-600">{stats.activeCars}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="text-sm text-gray-600">Rating</span>
                      <span className="font-bold text-purple-600">{stats.averageRating.toFixed(1)} ⭐</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/vendor-dashboard">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/vendor-dashboard/cars">
                      <Car className="h-4 w-4 mr-2" />
                      My Cars
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/vendor-dashboard/bookings">
                      <Package className="h-4 w-4 mr-2" />
                      Bookings
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/vendor-dashboard/drivers">
                      <Users className="h-4 w-4 mr-2" />
                      Drivers
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/vendor-dashboard/earnings">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Earnings
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/vendor-dashboard/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Welcome back, {profile.business_name}!</h1>
              <p className="text-gray-600">Manage your car rental business</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Total Cars
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalCars}</div>
                  <p className="text-xs text-gray-500">{stats.activeCars} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-gray-500">{stats.activeBookings} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">₦{stats.monthlyRevenue.toLocaleString()} this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.completionRate.toFixed(0)}%</div>
                  <p className="text-xs text-gray-500">Completion rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button className="h-20 flex-col space-y-2 bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/vendor-dashboard/cars/add">
                  <PlusCircle className="h-6 w-6" />
                  <span>Add New Car</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/vendor-dashboard/calendar">
                  <Calendar className="h-6 w-6" />
                  <span>Manage Calendar</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/vendor-dashboard/support">
                  <Users className="h-6 w-6" />
                  <span>Customer Support</span>
                </Link>
              </Button>
            </div>

            <Tabs defaultValue="cars" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cars">My Cars</TabsTrigger>
                <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
              </TabsList>

              <TabsContent value="cars" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Cars</CardTitle>
                      <CardDescription>Manage your vehicle inventory</CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/vendor-dashboard/cars/add">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Car
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading cars...</div>
                    ) : cars.length === 0 ? (
                      <div className="text-center py-8">
                        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">You haven't added any cars yet</p>
                        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href="/vendor-dashboard/cars/add">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Your First Car
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cars.slice(0, 6).map((car) => (
                          <Card key={car.id} className="overflow-hidden">
                            <div className="relative h-40">
                              <Image
                                src={car.primary_image_url || "/placeholder.svg?height=160&width=320"}
                                alt={`${car.make} ${car.model}`}
                                fill
                                className="object-cover"
                              />
                              <Badge className={`absolute top-2 right-2 ${getStatusColor(car.status)}`}>
                                {car.status}
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-lg">
                                {car.make} {car.model}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">{car.year}</p>
                              <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-blue-600">₦{car.daily_rate.toLocaleString()}/day</p>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                  <span className="text-sm">{car.average_rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">{car.total_bookings} bookings</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-dashboard/cars/${car.id}`}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-dashboard/cars/${car.id}/edit`}>
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  {cars.length > 6 && (
                    <CardFooter className="flex justify-center">
                      <Button variant="outline" asChild>
                        <Link href="/vendor-dashboard/cars">View All Cars ({cars.length})</Link>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Manage your car bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No bookings yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold">
                                    {booking.cars.make} {booking.cars.model} ({booking.cars.year})
                                  </h3>
                                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                  <div>
                                    <p className="font-medium">Customer</p>
                                    <p>
                                      {booking.users.first_name} {booking.users.last_name}
                                    </p>
                                    <p>{booking.users.phone}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Dates</p>
                                    <p>{new Date(booking.pickup_date).toLocaleDateString()}</p>
                                    <p>to {new Date(booking.return_date).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Amount</p>
                                    <p className="text-lg font-bold text-green-600">
                                      ₦{booking.total_amount.toLocaleString()}
                                    </p>
                                    <p className="text-xs">#{booking.booking_reference}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/vendor-dashboard/bookings/${booking.id}`}>
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  {bookings.length > 5 && (
                    <CardFooter className="flex justify-center">
                      <Button variant="outline" asChild>
                        <Link href="/vendor-dashboard/bookings">View All Bookings ({bookings.length})</Link>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
