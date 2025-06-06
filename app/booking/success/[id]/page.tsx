"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CheckCircle, Calendar, MapPin, User, Car, Phone, Mail, Download, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"

export default function BookingSuccessPage() {
  const params = useParams()
  const bookingId = params.id as string
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookingDetails()
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          cars (
            name,
            brand,
            model,
            images,
            transmission,
            fuel_type,
            seats
          ),
          drivers (
            first_name,
            last_name,
            phone,
            rating
          ),
          users (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq("id", bookingId)
        .single()

      if (error) throw error
      setBooking(data)
    } catch (error) {
      console.error("Error fetching booking details:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateBookingReference = () => {
    return `QADA-${booking?.id?.slice(-8).toUpperCase()}`
  }

  const shareBooking = () => {
    const text = `I just booked a ${booking?.cars?.brand} ${booking?.cars?.model} on QADA.ng! Booking reference: ${generateBookingReference()}`
    if (navigator.share) {
      navigator.share({
        title: "QADA.ng Booking Confirmation",
        text,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert("Booking details copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold text-amber-600">
              QADA.ng
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your car rental has been successfully booked</p>
          <p className="text-sm text-gray-500 mt-2">
            Booking Reference: <span className="font-mono font-semibold">{generateBookingReference()}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Details */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Image
                    src={booking.cars?.images?.[0] || "/placeholder.svg"}
                    alt={booking.cars?.name}
                    width={150}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl">
                      {booking.cars?.brand} {booking.cars?.model}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {booking.cars?.seats} seats
                      </div>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-gray-400" />
                        {booking.cars?.transmission}
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-gray-400">⛽</span>
                        {booking.cars?.fuel_type}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Pickup Date & Time</Label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                      <span>{new Date(booking.pickup_date).toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Return Date & Time</Label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                      <span>{new Date(booking.return_date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Pickup Location</Label>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                      <span>{booking.pickup_location}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Return Location</Label>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                      <span>{booking.return_location}</span>
                    </div>
                  </div>
                </div>

                {booking.with_driver && booking.drivers && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Assigned Driver</Label>
                      <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {booking.drivers.first_name} {booking.drivers.last_name}
                            </p>
                            <div className="flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-600">{booking.drivers.phone}</span>
                            </div>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800">⭐ {booking.drivers.rating}</Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {booking.special_requests && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Special Requests</Label>
                      <p className="mt-1 text-gray-700">{booking.special_requests}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Before Pickup</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Bring a valid driver's license and ID</li>
                    <li>• Arrive 15 minutes before pickup time</li>
                    <li>• Inspect the vehicle before driving</li>
                    <li>• Take photos of any existing damage</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">During Rental</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Follow traffic rules and regulations</li>
                    <li>• Keep the vehicle clean and tidy</li>
                    <li>• Contact us immediately for any issues</li>
                    <li>• Return with the same fuel level</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Rental Cost</span>
                  <span>₦{(booking.total_amount - booking.service_fee - booking.driver_fee).toLocaleString()}</span>
                </div>
                {booking.driver_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Driver Fee</span>
                    <span>₦{booking.driver_fee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>₦{booking.service_fee.toLocaleString()}</span>
                </div>
                {booking.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₦{booking.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid</span>
                  <span>₦{booking.total_amount.toLocaleString()}</span>
                </div>
                <Badge className="w-full justify-center bg-green-100 text-green-800">Payment Confirmed</Badge>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={shareBooking}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Booking
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Link href="/support">
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-2">24/7 Customer Support</p>
                  <div className="flex items-center mb-1">
                    <Phone className="h-4 w-4 mr-2 text-amber-500" />
                    <span>+234-700-QADA-NG</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-amber-500" />
                    <span>support@qada.ng</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-amber-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Prepare for Pickup</h3>
                <p className="text-sm text-gray-600">Gather required documents and arrive on time</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-amber-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Enjoy Your Trip</h3>
                <p className="text-sm text-gray-600">Drive safely and explore with confidence</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-amber-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Leave a Review</h3>
                <p className="text-sm text-gray-600">Share your experience and earn reward points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
