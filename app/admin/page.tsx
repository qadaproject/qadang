"use client"

import { useState } from "react"
import {
  Users,
  Car,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Search,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  const platformStats = {
    totalUsers: 15420,
    totalVendors: 542,
    totalBookings: 8934,
    totalRevenue: 45600000,
    platformFee: 4560000,
    activeDisputes: 12,
    userGrowth: 15.2,
    vendorGrowth: 8.7,
    bookingGrowth: 22.1,
    revenueGrowth: 18.5,
  }

  const recentVendors = [
    {
      id: 1,
      name: "Premium Cars Abuja",
      email: "info@premiumcarsabuja.com",
      phone: "+234 803 123 4567",
      location: "Abuja",
      status: "pending",
      joinDate: "2024-12-10",
      carsListed: 0,
      documents: "incomplete",
    },
    {
      id: 2,
      name: "Lagos Luxury Rentals",
      email: "contact@lagosluxury.ng",
      phone: "+234 701 987 6543",
      location: "Lagos",
      status: "approved",
      joinDate: "2024-12-08",
      carsListed: 8,
      documents: "verified",
    },
    {
      id: 3,
      name: "Port Harcourt Cars",
      email: "hello@phcars.com",
      phone: "+234 805 456 7890",
      location: "Port Harcourt",
      status: "rejected",
      joinDate: "2024-12-05",
      carsListed: 0,
      documents: "rejected",
    },
  ]

  const disputes = [
    {
      id: "DSP001",
      booking: "BK12345",
      customer: "John Doe",
      vendor: "Lagos Car Rentals",
      issue: "Vehicle damage claim",
      amount: 150000,
      status: "open",
      priority: "high",
      createdAt: "2024-12-12",
    },
    {
      id: "DSP002",
      booking: "BK12346",
      customer: "Jane Smith",
      vendor: "Abuja Premium Cars",
      issue: "Late return fee dispute",
      amount: 25000,
      status: "investigating",
      priority: "medium",
      createdAt: "2024-12-11",
    },
    {
      id: "DSP003",
      booking: "BK12347",
      customer: "Mike Johnson",
      vendor: "Port Harcourt Rentals",
      issue: "Booking cancellation refund",
      amount: 75000,
      status: "resolved",
      priority: "low",
      createdAt: "2024-12-10",
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "security",
      message: "Multiple failed login attempts detected for vendor account",
      severity: "high",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "payment",
      message: "Payment gateway experiencing intermittent issues",
      severity: "medium",
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      type: "system",
      message: "Scheduled maintenance completed successfully",
      severity: "low",
      timestamp: "1 day ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "verified":
      case "resolved":
        return "bg-green-100 text-green-800"
      case "pending":
      case "investigating":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
      case "open":
        return "bg-red-100 text-red-800"
      case "incomplete":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
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
              <Badge className="bg-red-100 text-red-800">Admin Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                System Health
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">admin@qada.ng</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Admin Settings</DropdownMenuItem>
                  <DropdownMenuItem>System Logs</DropdownMenuItem>
                  <DropdownMenuItem>Security</DropdownMenuItem>
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage the QADA.ng platform operations.</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{platformStats.userGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{platformStats.vendorGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalBookings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{platformStats.bookingGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{platformStats.platformFee.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{platformStats.revenueGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              System Alerts
            </CardTitle>
            <CardDescription>Recent system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                  <Badge className={getPriorityColor(alert.severity)}>{alert.severity}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Vendor Applications</CardTitle>
                  <CardDescription>Review and approve new vendor registrations</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search vendors..." className="pl-8 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Cars Listed</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{vendor.email}</div>
                            <div className="text-gray-500">{vendor.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{vendor.location}</TableCell>
                        <TableCell>{vendor.joinDate}</TableCell>
                        <TableCell>{vendor.carsListed}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vendor.documents)}>{vendor.documents}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
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
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Suspend
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

          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Disputes</CardTitle>
                  <CardDescription>Manage customer and vendor disputes</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
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
                      <TableHead>Dispute ID</TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell className="font-medium">{dispute.id}</TableCell>
                        <TableCell>{dispute.booking}</TableCell>
                        <TableCell>{dispute.customer}</TableCell>
                        <TableCell>{dispute.vendor}</TableCell>
                        <TableCell>{dispute.issue}</TableCell>
                        <TableCell>₦{dispute.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(dispute.priority)}>{dispute.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
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
                                Investigate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Resolve
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                  <CardDescription>User and vendor acquisition trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Growth analytics chart would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Platform revenue and commission tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Revenue analytics chart would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Platform health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">94%</div>
                    <p className="text-sm text-gray-600">Platform Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">4.7</div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">89%</div>
                    <p className="text-sm text-gray-600">Booking Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">2.3s</div>
                    <p className="text-sm text-gray-600">Average Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                  <CardDescription>Manage platform-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Commission Rate</h4>
                      <p className="text-sm text-gray-500">Platform commission percentage</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">10%</span>
                      <Button variant="outline" size="sm" className="ml-2">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Service Fee</h4>
                      <p className="text-sm text-gray-500">Fixed service fee per booking</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₦2,500</span>
                      <Button variant="outline" size="sm" className="ml-2">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Minimum Booking Duration</h4>
                      <p className="text-sm text-gray-500">Minimum rental period</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">1 day</span>
                      <Button variant="outline" size="sm" className="ml-2">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Platform security and compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Require 2FA for vendors</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">KYC Verification</h4>
                      <p className="text-sm text-gray-500">Mandatory vendor verification</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Fraud Detection</h4>
                      <p className="text-sm text-gray-500">Automated fraud monitoring</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
