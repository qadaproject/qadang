"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Car, Package, Users, CreditCard, LogOut, Settings, PlusCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CarData {
  id: string
  make: string
  model: string
  year: number
  daily_rate: number
  status: string
  image_url: string
  total_bookings: number
}

interface BookingData {
  id: string
  car_id: string
  car_make: string
  car_model: string
  customer_name: string
  start_date: string
  end_date: string
  total_amount: number
  status: string
}

export default function VendorDashboardPage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const [cars, setCars] = useState<CarData[]>([])
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || profile?.role !== "vendor") {
      router.push("/auth/login?tab=vendor")
      return
    }

    const fetchVendorData = async () => {
      try {
        // Fetch vendor's cars
        const { data: carsData, error: carsError } = await supabase.from("cars").select("*").eq("vendor_id", user.id)

        if (carsError) throw carsError

        // Fetch vendor's bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            id,
            car_id,
            cars (make, model),
            users (first_name, last_name),
            start_date,
            end_date,
            total_amount,
            status
          `)
          .eq("vendor_id", user.id)
          .order("created_at", { ascending: false })

        if (bookingsError) throw bookingsError

        // Format the data
        const formattedCars = carsData || []
        const formattedBookings = (bookingsData || []).map((booking: any) => ({
          id: booking.id,
          car_id: booking.car_id,
          car_make: booking.cars?.make || "Unknown",
          car_model: booking.cars?.model || "Unknown",
          customer_name: `${booking.users?.first_name || ""} ${booking.users?.last_name || ""}`,
          start_date: booking.start_date,
          end_date: booking.end_date,
          total_amount: booking.total_amount,
          status: booking.status,
        }))

        setCars(formattedCars)
        setBookings(formattedBookings)
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
              <Button variant="ghost" className="text-white hover:bg-blue-800" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder-business.jpg" alt={profile.business_name} />
                    <AvatarFallback>{profile.business_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{profile.business_name}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">Vendor</Badge>
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
          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
              <p className="text-gray-500">Manage your car rental business</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Cars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{cars.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{bookings.filter((b) => b.status === "active").length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ₦{bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
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
                      <CardDescription>Manage your car listings</CardDescription>
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
                        <p className="text-gray-500 mb-4">You haven't added any cars yet</p>
                        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href="/vendor-dashboard/cars/add">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Your First Car
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cars.map((car) => (
                          <Card key={car.id} className="overflow-hidden">
                            <div className="h-40 bg-gray-100">
                              <img
                                src={car.image_url || "/placeholder.svg?height=160&width=320"}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold">
                                {car.make} {car.model} ({car.year})
                              </h3>
                              <div className="flex justify-between items-center mt-2">
                                <p className="font-semibold text-blue-600">₦{car.daily_rate.toLocaleString()}/day</p>
                                <Badge
                                  className={
                                    car.status === "available"
                                      ? "bg-green-100 text-green-800"
                                      : car.status === "booked"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-red-100 text-red-800"
                                  }
                                >
                                  {car.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{car.total_bookings || 0} bookings</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-end">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-dashboard/cars/${car.id}`}>Manage</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" asChild>
                      <Link href="/vendor-dashboard/cars">View All Cars</Link>
                    </Button>
                  </CardFooter>
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
                        <p className="text-gray-500">No bookings yet</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">Car</th>
                              <th className="text-left py-3 px-2">Customer</th>
                              <th className="text-left py-3 px-2">Dates</th>
                              <th className="text-left py-3 px-2">Amount</th>
                              <th className="text-left py-3 px-2">Status</th>
                              <th className="text-left py-3 px-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.slice(0, 5).map((booking) => (
                              <tr key={booking.id} className="border-b">
                                <td className="py-3 px-2">
                                  {booking.car_make} {booking.car_model}
                                </td>
                                <td className="py-3 px-2">{booking.customer_name}</td>
                                <td className="py-3 px-2">
                                  {new Date(booking.start_date).toLocaleDateString()} -{" "}
                                  {new Date(booking.end_date).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-2">₦{booking.total_amount.toLocaleString()}</td>
                                <td className="py-3 px-2">
                                  <Badge
                                    className={
                                      booking.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : booking.status === "pending"
                                          ? "bg-orange-100 text-orange-800"
                                          : booking.status === "completed"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {booking.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/vendor-dashboard/bookings/${booking.id}`}>View</Link>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" asChild>
                      <Link href="/vendor-dashboard/bookings">View All Bookings</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
