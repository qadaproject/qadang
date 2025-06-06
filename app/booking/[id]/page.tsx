"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Shield, Users, Fuel, Settings, Gift, Wallet } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase, type CarType, type Driver, type User as UserType, type Discount } from "@/lib/supabase"
import { initializePayment, generateReference } from "@/lib/paystack"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const carId = params.id as string

  const [car, setCar] = useState<CarType | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [withDriver, setWithDriver] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null)
  const [useWallet, setUseWallet] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  // Booking details from URL params or state
  const [bookingDetails, setBookingDetails] = useState({
    pickupDate: new Date(),
    returnDate: new Date(),
    pickupLocation: "",
    returnLocation: "",
    specialRequests: "",
  })

  useEffect(() => {
    fetchCarDetails()
    fetchUser()
    if (withDriver) {
      fetchAvailableDrivers()
    }
  }, [carId, withDriver])

  const fetchCarDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          vendors (
            business_name,
            rating,
            phone
          )
        `)
        .eq("id", carId)
        .single()

      if (error) throw error
      setCar(data)
    } catch (error) {
      console.error("Error fetching car details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (error) throw error
        setUser(data)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchAvailableDrivers = async () => {
    if (!car) return

    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("vendor_id", car.vendor_id)
        .eq("status", "available")

      if (error) throw error
      setDrivers(data || [])
    } catch (error) {
      console.error("Error fetching drivers:", error)
    }
  }

  const applyDiscountCode = async () => {
    if (!discountCode.trim()) return

    try {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("code", discountCode.toUpperCase())
        .eq("status", "active")
        .single()

      if (error) {
        alert("Invalid discount code")
        return
      }

      // Check if discount is still valid
      const now = new Date()
      const validFrom = new Date(data.valid_from)
      const validUntil = new Date(data.valid_until)

      if (now < validFrom || now > validUntil) {
        alert("Discount code has expired")
        return
      }

      if (data.used_count >= data.usage_limit) {
        alert("Discount code usage limit reached")
        return
      }

      setAppliedDiscount(data)
      alert("Discount code applied successfully!")
    } catch (error) {
      console.error("Error applying discount:", error)
      alert("Error applying discount code")
    }
  }

  const calculateTotalAmount = () => {
    if (!car) return 0

    const days = Math.ceil(
      (bookingDetails.returnDate.getTime() - bookingDetails.pickupDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const carCost = car.price_per_day * days
    const driverCost =
      withDriver && selectedDriver ? (drivers.find((d) => d.id === selectedDriver)?.hourly_rate || 0) * 24 * days : 0
    const serviceFee = 2500

    const subtotal = carCost + driverCost + serviceFee
    let discountAmount = 0

    if (appliedDiscount) {
      if (appliedDiscount.type === "percentage") {
        discountAmount = Math.min((subtotal * appliedDiscount.value) / 100, appliedDiscount.max_discount)
      } else {
        discountAmount = Math.min(appliedDiscount.value, subtotal)
      }
    }

    const total = subtotal - discountAmount
    const walletDeduction = useWallet ? Math.min(user?.wallet_balance || 0, total) : 0
    const finalAmount = total - walletDeduction

    return {
      carCost,
      driverCost,
      serviceFee,
      subtotal,
      discountAmount,
      walletDeduction,
      total: finalAmount,
      days,
    }
  }

  const handleBooking = async () => {
    if (!car || !user) return

    setProcessing(true)
    try {
      const amounts = calculateTotalAmount()
      const reference = generateReference()

      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          car_id: car.id,
          driver_id: withDriver ? selectedDriver : null,
          pickup_date: bookingDetails.pickupDate.toISOString(),
          return_date: bookingDetails.returnDate.toISOString(),
          pickup_location: bookingDetails.pickupLocation,
          return_location: bookingDetails.returnLocation,
          total_amount: amounts.total,
          discount_amount: amounts.discountAmount,
          service_fee: amounts.serviceFee,
          driver_fee: amounts.driverCost,
          status: "pending",
          payment_status: "pending",
          payment_reference: reference,
          with_driver: withDriver,
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // If using wallet, deduct amount
      if (useWallet && amounts.walletDeduction > 0) {
        await supabase
          .from("users")
          .update({
            wallet_balance: (user.wallet_balance || 0) - amounts.walletDeduction,
          })
          .eq("id", user.id)

        // Record wallet transaction
        await supabase.from("wallet_transactions").insert({
          user_id: user.id,
          type: "debit",
          amount: amounts.walletDeduction,
          description: `Booking payment for ${car.name}`,
          reference: reference,
          status: "completed",
        })
      }

      // If there's remaining amount, initialize payment
      if (amounts.total > 0) {
        const paymentResponse = await initializePayment(user.email, amounts.total, reference, {
          booking_id: booking.id,
          car_name: car.name,
          user_id: user.id,
        })

        if (paymentResponse.status) {
          window.location.href = paymentResponse.data.authorization_url
        } else {
          throw new Error("Payment initialization failed")
        }
      } else {
        // If fully paid with wallet, mark as paid
        await supabase.from("bookings").update({ payment_status: "paid", status: "confirmed" }).eq("id", booking.id)

        router.push(`/booking/success/${booking.id}`)
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Error creating booking. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Car not found</h1>
          <Link href="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    )
  }

  const amounts = calculateTotalAmount()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href={`/cars/${car.id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/" className="text-2xl font-bold text-amber-600">
                QADA.ng
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Image
                    src={car.images[0] || "/placeholder.svg"}
                    alt={car.name}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{car.name}</h3>
                    <p className="text-gray-600">{car.vendors?.business_name}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {car.seats} seats
                      </div>
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-1" />
                        {car.transmission}
                      </div>
                      <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-1" />
                        {car.fuel_type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-600">₦{car.price_per_day.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Option */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Option</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={withDriver ? "with-driver" : "self-drive"}
                  onValueChange={(value) => setWithDriver(value === "with-driver")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self-drive" id="self-drive" />
                    <Label htmlFor="self-drive">Self Drive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="with-driver" id="with-driver" />
                    <Label htmlFor="with-driver">With Professional Driver</Label>
                  </div>
                </RadioGroup>

                {withDriver && (
                  <div className="mt-4 space-y-4">
                    <Label>Select Driver</Label>
                    <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.first_name} {driver.last_name} - ₦{driver.hourly_rate}/hour (Rating: {driver.rating}
                            )
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Pickup Location</Label>
                    <Input
                      value={bookingDetails.pickupLocation}
                      onChange={(e) => setBookingDetails((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                      placeholder="Enter pickup location"
                    />
                  </div>
                  <div>
                    <Label>Return Location</Label>
                    <Input
                      value={bookingDetails.returnLocation}
                      onChange={(e) => setBookingDetails((prev) => ({ ...prev, returnLocation: e.target.value }))}
                      placeholder="Enter return location"
                    />
                  </div>
                </div>
                <div>
                  <Label>Special Requests (Optional)</Label>
                  <Textarea
                    value={bookingDetails.specialRequests}
                    onChange={(e) => setBookingDetails((prev) => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requests or requirements..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Discount Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Discount Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-1"
                  />
                  <Button onClick={applyDiscountCode} variant="outline">
                    Apply
                  </Button>
                </div>
                {appliedDiscount && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      Discount applied:{" "}
                      {appliedDiscount.type === "percentage"
                        ? `${appliedDiscount.value}%`
                        : `₦${appliedDiscount.value}`}{" "}
                      off
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                </RadioGroup>

                {user && user.wallet_balance > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="use-wallet" checked={useWallet} onCheckedChange={setUseWallet} />
                      <Label htmlFor="use-wallet" className="flex items-center">
                        <Wallet className="h-4 w-4 mr-2" />
                        Use Wallet Balance (₦{user.wallet_balance.toLocaleString()})
                      </Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Car rental ({amounts.days} days)</span>
                    <span>₦{amounts.carCost.toLocaleString()}</span>
                  </div>
                  {withDriver && amounts.driverCost > 0 && (
                    <div className="flex justify-between">
                      <span>Driver fee ({amounts.days} days)</span>
                      <span>₦{amounts.driverCost.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₦{amounts.serviceFee.toLocaleString()}</span>
                  </div>
                  {amounts.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₦{amounts.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {amounts.walletDeduction > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Wallet payment</span>
                      <span>-₦{amounts.walletDeduction.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₦{amounts.total.toLocaleString()}</span>
                </div>

                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  size="lg"
                  onClick={handleBooking}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Confirm Booking"}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-4 w-4 mr-1" />
                    Secure payment powered by Paystack
                  </div>
                  <p>
                    Your payment information is encrypted and secure. Free cancellation up to 24 hours before pickup.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
