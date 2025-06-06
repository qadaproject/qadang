"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, Car, Phone, Star, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingAnimation } from "@/components/ui/loading-animation"
import { supabase } from "@/lib/supabase"

interface Booking {
  id: string
  car_id: string
  pickup_date: string
  return_date: string
  pickup_location: string
  return_location: string
  total_amount: number
  status: string
  with_driver: boolean
  created_at: string
  car: {
    make: string
    model: string
    year: number
    image_url: string
    license_plate: string
  }
  driver?: {
    name: string
    phone: string
    rating: number
    profile_image: string
  }
}

export default function BookingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }

    if (user) {
      fetchBookings()
    }
  }, [user, loading, router])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          car:cars(*),
          driver:drivers(*)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      console.error("Error fetching bookings:", err)
    } finally {
      setLoadingBookings(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterBookings = (status: string) => {
    if (status === "all") return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingAnimation text="Loading your bookings..." />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const filteredBookings = filterBookings(activeTab)

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
                <h1 className="text-2xl font-bold">My Bookings</h1>
                <p className="text-gray-600">Manage your car rental bookings</p>
              </div>
            </div>
            <Link href="/search">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Car className="h-4 w-4 mr-2" />
                Book New Car
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </div>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter((b) => b.status === "pending").length}
                </div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {bookings.filter((b) => b.status === "completed").length}
                </div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>View and manage all your car rental bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                    <p className="text-gray-600 mb-4">
                      {activeTab === "all" ? "You haven't made any bookings yet" : `No ${activeTab} bookings found`}
                    </p>
                    <Link href="/search">
                      <Button className="bg-blue-600 hover:bg-blue-700">Book Your First Car</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <Card key={booking.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Car Info */}
                            <div className="flex items-center space-x-4">
                              <img
                                src={booking.car.image_url || "/placeholder.svg?height=80&width=120"}
                                alt={`${booking.car.make} ${booking.car.model}`}
                                className="w-20 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {booking.car.make} {booking.car.model} {booking.car.year}
                                </h3>
                                <p className="text-sm text-gray-600">License: {booking.car.license_plate}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </Badge>
                                  {booking.with_driver && <Badge variant="outline">With Driver</Badge>}
                                </div>
                              </div>
                            </div>

                            {/* Booking Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 lg:mx-8">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>
                                    {new Date(booking.pickup_date).toLocaleDateString()} -{" "}
                                    {new Date(booking.return_date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>{booking.pickup_location}</span>
                                </div>
                                {booking.return_location !== booking.pickup_location && (
                                  <div className="flex items-center text-sm">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>Return: {booking.return_location}</span>
                                  </div>
                                )}
                              </div>

                              {booking.with_driver && booking.driver && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={booking.driver.profile_image || "/placeholder.svg"} />
                                      <AvatarFallback>{booking.driver.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{booking.driver.name}</p>
                                      <div className="flex items-center">
                                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                        <span className="text-xs">{booking.driver.rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{booking.driver.phone}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Price and Actions */}
                            <div className="text-right space-y-2">
                              <div className="text-2xl font-bold text-green-600">
                                ₦{booking.total_amount.toLocaleString()}
                              </div>
                              <div className="space-y-2">
                                <Link href={`/bookings/${booking.id}`}>
                                  <Button variant="outline" size="sm" className="w-full">
                                    View Details
                                  </Button>
                                </Link>
                                {booking.status === "confirmed" && (
                                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Voucher
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
