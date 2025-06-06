"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { format, addDays, differenceInDays } from "date-fns"
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Fuel,
  Settings,
  Shield,
  Calendar,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Wifi,
  Snowflake,
  Navigation,
  Bluetooth,
  Car,
  CreditCard,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface CarDetails {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price_per_day: number
  transmission: string
  fuel_type: string
  seats: number
  features: string[]
  images: string[]
  location: string
  address: string
  rating: number
  total_bookings: number
  description: string
  vendor_id: string
  vendors: {
    id: string
    business_name: string
    rating: number
    total_cars: number
    phone: string
    email: string
    profile_image?: string
  }
}

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
  user_avatar?: string
}

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const carId = params.id as string

  const [car, setCar] = useState<CarDetails | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [pickupDate, setPickupDate] = useState<Date>(new Date())
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 3))
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnTime, setReturnTime] = useState("10:00")
  const [withDriver, setWithDriver] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    fetchCarDetails()
    fetchReviews()
  }, [carId])

  const fetchCarDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          vendors (
            id,
            business_name,
            rating,
            total_cars,
            phone,
            email,
            profile_image
          )
        `)
        .eq("id", carId)
        .single()

      if (error) throw error
      setCar(data)
    } catch (error) {
      console.error("Error fetching car details:", error)
      // Fallback data
      setCar({
        id: carId,
        name: "Toyota Corolla 2022",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        price_per_day: 15000,
        transmission: "Automatic",
        fuel_type: "Petrol",
        seats: 5,
        features: ["Air Conditioning", "Bluetooth", "GPS Navigation", "USB Port", "Backup Camera", "Cruise Control"],
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        location: "Lagos Island",
        address: "123 Marina Street, Lagos Island, Lagos State",
        rating: 4.8,
        total_bookings: 124,
        description:
          "Experience comfort and reliability with our well-maintained Toyota Corolla. Perfect for city driving and long trips. This vehicle comes with all modern amenities and is regularly serviced to ensure your safety and comfort.",
        vendor_id: "1",
        vendors: {
          id: "1",
          business_name: "Lagos Car Rentals",
          rating: 4.8,
          total_cars: 25,
          phone: "+234 801 234 5678",
          email: "info@lagoscarrentals.com",
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("car_id", carId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
      // Fallback data
      setReviews([
        {
          id: "1",
          user_name: "Adebayo Johnson",
          rating: 5,
          comment:
            "Excellent car and service! The vehicle was clean, well-maintained, and the pickup process was smooth. Highly recommended!",
          created_at: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          user_name: "Fatima Ahmed",
          rating: 4,
          comment:
            "Good experience overall. The car performed well during my trip to Abuja. Minor issue with the AC but was quickly resolved.",
          created_at: "2024-01-10T14:20:00Z",
        },
        {
          id: "3",
          user_name: "Chidi Okafor",
          rating: 5,
          comment:
            "Perfect for my business trip. Professional service and the car was exactly as described. Will definitely book again.",
          created_at: "2024-01-05T09:15:00Z",
        },
      ])
    }
  }

  const calculateTotalPrice = () => {
    const days = differenceInDays(returnDate, pickupDate) || 1
    const basePrice = car ? car.price_per_day * days : 0
    const driverFee = withDriver ? 5000 * days : 0
    const serviceFee = basePrice * 0.1
    const insurance = basePrice * 0.05

    return {
      basePrice,
      driverFee,
      serviceFee,
      insurance,
      total: basePrice + driverFee + serviceFee + insurance,
    }
  }

  const handleBooking = () => {
    if (!car) return

    const bookingData = {
      carId: car.id,
      pickupDate: pickupDate.toISOString(),
      returnDate: returnDate.toISOString(),
      pickupTime,
      returnTime,
      withDriver,
      totalPrice: calculateTotalPrice().total,
    }

    // Store booking data in localStorage for the booking page
    localStorage.setItem("bookingData", JSON.stringify(bookingData))
    router.push(`/booking/${car.id}`)
  }

  const nextImage = () => {
    if (car && car.images) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
    }
  }

  const prevImage = () => {
    if (car && car.images) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
    }
  }

  const getFeatureIcon = (feature: string) => {
    const featureLower = feature.toLowerCase()
    if (featureLower.includes("wifi") || featureLower.includes("internet")) return <Wifi className="h-4 w-4" />
    if (featureLower.includes("ac") || featureLower.includes("air")) return <Snowflake className="h-4 w-4" />
    if (featureLower.includes("gps") || featureLower.includes("navigation")) return <Navigation className="h-4 w-4" />
    if (featureLower.includes("bluetooth")) return <Bluetooth className="h-4 w-4" />
    return <Check className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Car not found</h1>
            <p className="text-gray-600 mb-4">The car you're looking for doesn't exist or has been removed.</p>
            <Link href="/search">
              <Button className="bg-[#0071c2] hover:bg-[#005999]">Browse Other Cars</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const pricing = calculateTotalPrice()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#0071c2]">
            Home
          </Link>
          <span>/</span>
          <Link href="/search" className="hover:text-[#0071c2]">
            Search
          </Link>
          <span>/</span>
          <span className="text-gray-900">{car.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to results
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src={car.images[currentImageIndex] || "/placeholder.svg?height=400&width=600"}
                  alt={car.name}
                  fill
                  className="object-cover"
                />

                {car.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/80 hover:bg-white"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
                  </Button>
                  <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {car.images.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentImageIndex ? "bg-white" : "bg-white/50",
                      )}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {car.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 border-2",
                        index === currentImageIndex ? "border-[#0071c2]" : "border-gray-200",
                      )}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg?height=64&width=80"}
                        alt={`${car.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Info */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{car.rating}</span>
                      <span className="ml-1">({car.total_bookings} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {car.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#0071c2]">₦{car.price_per_day.toLocaleString()}</div>
                  <div className="text-gray-500">per day</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {car.seats} seats
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  {car.transmission}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Fuel className="h-3 w-3" />
                  {car.fuel_type}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {car.year}
                </Badge>
              </div>

              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="features" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="vendor">Vendor</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Car Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {getFeatureIcon(feature)}
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Customer Reviews</span>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{car.rating}</span>
                        <span className="text-gray-500">({reviews.length} reviews)</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={review.user_avatar || "/placeholder.svg"} />
                              <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{review.user_name}</h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "h-4 w-4",
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(review.created_at), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pickup Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-[#0071c2] mt-0.5" />
                        <div>
                          <p className="font-medium">{car.location}</p>
                          <p className="text-gray-600 text-sm">{car.address}</p>
                        </div>
                      </div>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Map will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vendor" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rental Company</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={car.vendors.profile_image || "/placeholder.svg"} />
                        <AvatarFallback>{car.vendors.business_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{car.vendors.business_name}</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{car.vendors.rating}</span>
                          </div>
                          <span className="text-gray-600">{car.vendors.total_cars} cars available</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book this car</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#0071c2]">₦{car.price_per_day.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm font-medium">Pickup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(pickupDate, "MMM dd")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={pickupDate}
                          onSelect={(date) => date && setPickupDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Return Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(returnDate, "MMM dd")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={returnDate}
                          onSelect={(date) => date && setReturnDate(date)}
                          initialFocus
                          disabled={(date) => date < pickupDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm font-medium">Pickup Time</Label>
                    <Select value={pickupTime} onValueChange={setPickupTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(
                          (time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Return Time</Label>
                    <Select value={returnTime} onValueChange={setReturnTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(
                          (time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Driver Option */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="with-driver"
                    checked={withDriver}
                    onChange={(e) => setWithDriver(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="with-driver" className="text-sm">
                    Add professional driver (+₦5,000/day)
                  </Label>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Car rental ({differenceInDays(returnDate, pickupDate) || 1} days)</span>
                    <span>₦{pricing.basePrice.toLocaleString()}</span>
                  </div>
                  {withDriver && (
                    <div className="flex justify-between text-sm">
                      <span>Driver service</span>
                      <span>₦{pricing.driverFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Service fee</span>
                    <span>₦{pricing.serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Insurance</span>
                    <span>₦{pricing.insurance.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₦{pricing.total.toLocaleString()}</span>
                  </div>
                </div>

                <Button className="w-full bg-[#0071c2] hover:bg-[#005999]" size="lg" onClick={handleBooking}>
                  Book Now
                </Button>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Free cancellation up to 24 hours before pickup</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CreditCard className="h-4 w-4" />
                  <span>Secure payment with Paystack</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Vendor */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call {car.vendors.business_name}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
