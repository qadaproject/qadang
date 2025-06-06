"use client"

import { useState, useEffect } from "react"
import { Plus, Star, Phone, Mail, MapPin, Clock, Edit, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase, type Driver, type Vendor } from "@/lib/supabase"

export default function DriverManagementPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddingDriver, setIsAddingDriver] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)

  const [driverForm, setDriverForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    license_number: "",
    experience_years: 0,
    hourly_rate: 0,
    status: "available" as const,
  })

  useEffect(() => {
    fetchVendorData()
    fetchDrivers()
  }, [])

  const fetchVendorData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase.from("vendors").select("*").eq("email", user.email).single()

        if (error) throw error
        setVendor(data)
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error)
    }
  }

  const fetchDrivers = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: vendorData } = await supabase.from("vendors").select("id").eq("email", user.email).single()

        if (vendorData) {
          const { data, error } = await supabase
            .from("drivers")
            .select("*")
            .eq("vendor_id", vendorData.id)
            .order("created_at", { ascending: false })

          if (error) throw error
          setDrivers(data || [])
        }
      }
    } catch (error) {
      console.error("Error fetching drivers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDriver = async () => {
    if (!vendor) return

    setIsAddingDriver(true)
    try {
      const { error } = await supabase.from("drivers").insert({
        vendor_id: vendor.id,
        ...driverForm,
      })

      if (error) throw error

      alert("Driver added successfully!")
      setDriverForm({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        license_number: "",
        experience_years: 0,
        hourly_rate: 0,
        status: "available",
      })
      fetchDrivers()
    } catch (error) {
      console.error("Error adding driver:", error)
      alert("Error adding driver. Please try again.")
    } finally {
      setIsAddingDriver(false)
    }
  }

  const handleUpdateDriver = async () => {
    if (!editingDriver) return

    try {
      const { error } = await supabase.from("drivers").update(driverForm).eq("id", editingDriver.id)

      if (error) throw error

      alert("Driver updated successfully!")
      setEditingDriver(null)
      setDriverForm({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        license_number: "",
        experience_years: 0,
        hourly_rate: 0,
        status: "available",
      })
      fetchDrivers()
    } catch (error) {
      console.error("Error updating driver:", error)
      alert("Error updating driver. Please try again.")
    }
  }

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return

    try {
      const { error } = await supabase.from("drivers").delete().eq("id", driverId)

      if (error) throw error

      alert("Driver deleted successfully!")
      fetchDrivers()
    } catch (error) {
      console.error("Error deleting driver:", error)
      alert("Error deleting driver. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-yellow-100 text-yellow-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-amber-600">
                QADA.ng
              </Link>
              <Badge className="bg-amber-100 text-amber-800">Driver Management</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/vendor-dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Driver Management</h1>
            <p className="text-gray-600">Manage your professional drivers and their availability</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Add a professional driver to your fleet</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={driverForm.first_name}
                      onChange={(e) => setDriverForm((prev) => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={driverForm.last_name}
                      onChange={(e) => setDriverForm((prev) => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={driverForm.email}
                    onChange={(e) => setDriverForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={driverForm.license_number}
                    onChange={(e) => setDriverForm((prev) => ({ ...prev, license_number: e.target.value }))}
                    placeholder="Enter license number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience_years">Experience (Years)</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={driverForm.experience_years}
                      onChange={(e) =>
                        setDriverForm((prev) => ({ ...prev, experience_years: Number.parseInt(e.target.value) }))
                      }
                      placeholder="Years of experience"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (₦)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={driverForm.hourly_rate}
                      onChange={(e) =>
                        setDriverForm((prev) => ({ ...prev, hourly_rate: Number.parseFloat(e.target.value) }))
                      }
                      placeholder="Rate per hour"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddDriver}
                  disabled={isAddingDriver}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  {isAddingDriver ? "Adding..." : "Add Driver"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Driver Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drivers.length}</div>
              <p className="text-xs text-muted-foreground">Active drivers in your fleet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {drivers.filter((d) => d.status === "available").length}
              </div>
              <p className="text-xs text-muted-foreground">Ready for bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {drivers.length > 0
                  ? (drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1)
                  : "0.0"}
              </div>
              <p className="text-xs text-muted-foreground">Overall driver rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦
                {drivers.length > 0
                  ? Math.round(drivers.reduce((acc, d) => acc + d.hourly_rate, 0) / drivers.length).toLocaleString()
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground">Per hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Drivers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Drivers</CardTitle>
            <CardDescription>Manage your professional drivers and their details</CardDescription>
          </CardHeader>
          <CardContent>
            {drivers.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No drivers yet</h3>
                <p className="text-gray-600 mb-4">Add professional drivers to offer chauffeur services</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-500 hover:bg-amber-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Driver
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Rate/Hour</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {driver.first_name[0]}
                              {driver.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {driver.first_name} {driver.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{driver.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {driver.phone}
                          </div>
                          {driver.email && (
                            <div className="flex items-center mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {driver.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{driver.license_number}</TableCell>
                      <TableCell>{driver.experience_years} years</TableCell>
                      <TableCell>₦{driver.hourly_rate.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {driver.rating.toFixed(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(driver.status)}>{driver.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingDriver(driver)
                                setDriverForm({
                                  first_name: driver.first_name,
                                  last_name: driver.last_name,
                                  phone: driver.phone,
                                  email: driver.email || "",
                                  license_number: driver.license_number,
                                  experience_years: driver.experience_years,
                                  hourly_rate: driver.hourly_rate,
                                  status: driver.status,
                                })
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Driver
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDriver(driver.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Driver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Driver Dialog */}
        {editingDriver && (
          <Dialog open={!!editingDriver} onOpenChange={() => setEditingDriver(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Driver</DialogTitle>
                <DialogDescription>Update driver information and settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_first_name">First Name</Label>
                    <Input
                      id="edit_first_name"
                      value={driverForm.first_name}
                      onChange={(e) => setDriverForm((prev) => ({ ...prev, first_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_last_name">Last Name</Label>
                    <Input
                      id="edit_last_name"
                      value={driverForm.last_name}
                      onChange={(e) => setDriverForm((prev) => ({ ...prev, last_name: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_phone">Phone Number</Label>
                  <Input
                    id="edit_phone"
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_hourly_rate">Hourly Rate (₦)</Label>
                  <Input
                    id="edit_hourly_rate"
                    type="number"
                    value={driverForm.hourly_rate}
                    onChange={(e) =>
                      setDriverForm((prev) => ({ ...prev, hourly_rate: Number.parseFloat(e.target.value) }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <Select
                    value={driverForm.status}
                    onValueChange={(value) => setDriverForm((prev) => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleUpdateDriver} className="w-full bg-amber-500 hover:bg-amber-600">
                  Update Driver
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
