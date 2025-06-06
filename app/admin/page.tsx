"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Car, Users, CreditCard, LogOut, Settings, BarChart3, ShieldCheck, Building } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StatsData {
  totalUsers: number
  totalVendors: number
  totalCars: number
  totalBookings: number
  totalRevenue: number
}

interface VendorData {
  id: string
  business_name: string
  email: string
  status: string
  created_at: string
  total_cars: number
}

interface UserData {
  id: string
  first_name: string
  last_name: string
  email: string
  created_at: string
  wallet_balance: number
}

export default function AdminDashboardPage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalVendors: 0,
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
  })
  const [vendors, setVendors] = useState<VendorData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || profile?.role !== "admin") {
      router.push("/auth/login")
      return
    }

    const fetchAdminData = async () => {
      try {
        // Fetch stats
        const { data: usersCount } = await supabase.from("users").select("id", { count: "exact", head: true })

        const { data: vendorsCount } = await supabase.from("vendors").select("id", { count: "exact", head: true })

        const { data: carsCount } = await supabase.from("cars").select("id", { count: "exact", head: true })

        const { data: bookingsCount } = await supabase.from("bookings").select("id", { count: "exact", head: true })

        const { data: revenueData } = await supabase.from("bookings").select("total_amount")

        // Fetch recent vendors
        const { data: vendorsData, error: vendorsError } = await supabase
          .from("vendors")
          .select(`
            id,
            business_name,
            email,
            status,
            created_at
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        if (vendorsError) throw vendorsError

        // Count cars per vendor
        const vendorIds = vendorsData?.map((v) => v.id) || []
        const { data: vendorCars } = await supabase.from("cars").select("vendor_id").in("vendor_id", vendorIds)

        // Fetch recent users
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select(`
            id,
            first_name,
            last_name,
            email,
            created_at,
            wallet_balance
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        if (usersError) throw usersError

        // Calculate total revenue
        const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

        // Format vendor data with car counts
        const formattedVendors = (vendorsData || []).map((vendor) => {
          const carCount = vendorCars?.filter((car) => car.vendor_id === vendor.id).length || 0
          return {
            ...vendor,
            total_cars: carCount,
          }
        })

        setStats({
          totalUsers: usersCount?.length || 0,
          totalVendors: vendorsCount?.length || 0,
          totalCars: carsCount?.length || 0,
          totalBookings: bookingsCount?.length || 0,
          totalRevenue,
        })
        setVendors(formattedVendors)
        setUsers(usersData || [])
      } catch (err) {
        console.error("Error fetching admin data:", err)
        setError("Failed to load admin data")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
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
                    <AvatarImage src="/placeholder-admin.jpg" alt="Admin" />
                    <AvatarFallback>
                      <ShieldCheck className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">Admin Dashboard</h2>
                  <p className="text-gray-500">{profile.email}</p>
                  <Badge className="mt-2 bg-red-100 text-red-800">Administrator</Badge>
                </div>

                <div className="mt-6 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/users">
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/vendors">
                      <Building className="h-4 w-4 mr-2" />
                      Vendors
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/cars">
                      <Car className="h-4 w-4 mr-2" />
                      Cars
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/transactions">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Transactions
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/settings">
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
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-500">Platform overview and management</p>
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
                  <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalVendors}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Cars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalCars}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalBookings}</div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="vendors" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vendors">Recent Vendors</TabsTrigger>
                <TabsTrigger value="users">Recent Users</TabsTrigger>
              </TabsList>

              <TabsContent value="vendors" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Vendors</CardTitle>
                    <CardDescription>Recently registered car rental businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading vendors...</div>
                    ) : vendors.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No vendors registered yet</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">Business Name</th>
                              <th className="text-left py-3 px-2">Email</th>
                              <th className="text-left py-3 px-2">Status</th>
                              <th className="text-left py-3 px-2">Cars</th>
                              <th className="text-left py-3 px-2">Joined</th>
                              <th className="text-left py-3 px-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vendors.map((vendor) => (
                              <tr key={vendor.id} className="border-b">
                                <td className="py-3 px-2 font-medium">{vendor.business_name}</td>
                                <td className="py-3 px-2">{vendor.email}</td>
                                <td className="py-3 px-2">
                                  <Badge
                                    className={
                                      vendor.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : vendor.status === "pending"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {vendor.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-2">{vendor.total_cars}</td>
                                <td className="py-3 px-2">{new Date(vendor.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/vendors/${vendor.id}`}>View</Link>
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
                      <Link href="/admin/vendors">View All Vendors</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Recently registered customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading users...</div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No users registered yet</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">Name</th>
                              <th className="text-left py-3 px-2">Email</th>
                              <th className="text-left py-3 px-2">Wallet Balance</th>
                              <th className="text-left py-3 px-2">Joined</th>
                              <th className="text-left py-3 px-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user) => (
                              <tr key={user.id} className="border-b">
                                <td className="py-3 px-2 font-medium">
                                  {user.first_name} {user.last_name}
                                </td>
                                <td className="py-3 px-2">{user.email}</td>
                                <td className="py-3 px-2">₦{user.wallet_balance?.toLocaleString() || 0}</td>
                                <td className="py-3 px-2">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/users/${user.id}`}>View</Link>
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
                      <Link href="/admin/users">View All Users</Link>
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
