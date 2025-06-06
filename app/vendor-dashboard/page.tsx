"use client"

import { useState } from "react"
import {
  Plus,
  Car,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Download,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VendorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  const stats = {
    totalBookings: 156,
    activeListings: 12,
    totalRevenue: 2340000,
    averageRating: 4.8,
    bookingGrowth: 12.5,
    revenueGrowth: 8.3,
  }

  const recentBookings = [
    {
      id: "BK001",
      customer: "Adebayo Johnson",
      car: "Toyota Corolla 2022",
      dates: "Dec 15-18, 2024",
      amount: 45000,
      status: "confirmed",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "BK002",
      customer: "Sarah Okafor",
      car: "Honda Accord 2023",
      dates: "Dec 20-22, 2024",
      amount: 75000,
      status: "pending",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "BK003",
      customer: "Michael Eze",
      car: "Hyundai Elantra 2022",
      dates: "Dec 12-15, 2024",
      amount: 54000,
      status: "completed",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "BK004",
      customer: "Fatima Abdullahi",
      car: "Toyota Corolla 2022",
      dates: "Dec 18-20, 2024",
      amount: 30000,
      status: "cancelled",
      avatar: "/placeholder-user.jpg",
    },
  ]

  const carListings = [
    {
      id: 1,
      name: "Toyota Corolla 2022",
      price: 15000,
      status: "active",
      bookings: 24,
      rating: 4.8,
      revenue: 360000,
      image: "/placeholder.svg?height=100&width=150",
      views: 1250,
    },
    {
      id: 2,
      name: "Honda Accord 2023",
      price: 25000,
      status: "active",
      bookings: 18,
      rating: 4.9,
      revenue: 450000,
      image: "/placeholder.svg?height=100&width=150",
      views: 980,
    },
    {
      id: 3,
      name: "Hyundai Elantra 2022",
      price: 18000,
      status: "maintenance",
      bookings: 15,
      rating: 4.7,
      revenue: 270000,
      image: "/placeholder.svg?height=100&width=150",
      views: 750,
    },
    {
      id: 4,
      name: "Kia Picanto 2021",
      price: 12000,
      status: "active",
      bookings: 32,
      rating: 4.5,
      revenue: 384000,
      image: "/placeholder.svg?height=100&width=150",
      views: 1450,
    },
  ]

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
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                QADA.ng
              </Link>
              <Badge className="bg-blue-100 text-blue-800">Vendor Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="Vendor" />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Lagos Car Rentals</p>
                      <p className="text-xs leading-none text-muted-foreground">vendor@lagoscarrentals.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Lagos Car Rentals!</h1>
          <p className="text-gray-600">Here's what's happening with your car rental business today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.bookingGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">4 cars available today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.revenueGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="listings">My Cars</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Latest booking requests and confirmations</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 4).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={booking.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {booking.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{booking.customer}</p>
                          <p className="text-xs text-gray-500">
                            {booking.car} • {booking.dates}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">₦{booking.amount.toLocaleString()}</p>
                          <Badge className={`text-xs ${getStatusColor(booking.status)}`}>{booking.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Cars */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Cars</CardTitle>
                  <CardDescription>Your most booked vehicles this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {carListings.slice(0, 4).map((car) => (
                      <div key={car.id} className="flex items-center space-x-4">
                        <Image
                          src={car.image || "/placeholder.svg"}
                          alt={car.name}
                          width={60}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{car.name}</p>
                          <p className="text-xs text-gray-500">
                            {car.bookings} bookings • ₦{car.price.toLocaleString()}/day
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">₦{car.revenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{car.views} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your listings and bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col space-y-2">
                    <Plus className="h-6 w-6" />
                    <span>Add New Car</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span>Manage Calendar</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Users className="h-6 w-6" />
                    <span>Customer Support</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Bookings</CardTitle>
                  <CardDescription>Manage your booking requests and confirmations</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Car</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={booking.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {booking.customer
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{booking.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{booking.car}</TableCell>
                        <TableCell>{booking.dates}</TableCell>
                        <TableCell>₦{booking.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Car Listings</CardTitle>
                  <CardDescription>Manage your vehicle inventory and pricing</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Car
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {carListings.map((car) => (
                    <Card key={car.id} className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={car.image || "/placeholder.svg"}
                          alt={car.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-3 right-3 ${getStatusColor(car.status)}`}>{car.status}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{car.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Price per day:</span>
                            <span className="font-medium">₦{car.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total bookings:</span>
                            <span>{car.bookings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <span>{car.rating} ⭐</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Revenue:</span>
                            <span className="font-medium">₦{car.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Track your earnings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Revenue chart would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Monitor booking patterns and demand</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Booking trends chart would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">85%</div>
                    <p className="text-sm text-gray-600">Booking Acceptance Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">4.2</div>
                    <p className="text-sm text-gray-600">Average Trip Duration (days)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">92%</div>
                    <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
