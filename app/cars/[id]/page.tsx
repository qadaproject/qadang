"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Fuel,
  Settings,
  Shield,
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function CarDetailsPage() {
  const [pickupDate, setPickupDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const car = {
    id: 1,
    name: "Toyota Corolla 2022",
    vendor: {
      name: "Lagos Car Rentals",
      rating: 4.8,
      reviews: 124,
      verified: true,
      joinedDate: "2020",
      responseTime: "Within 1 hour",
      avatar: "/placeholder-user.jpg",
    },
    price: 15000,
    originalPrice: 18000,
    rating: 4.8,
    reviews: 124,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    features: ["Automatic", "AC", "4 Seats", "Bluetooth", "USB Port", "AUX Input"],
    location: "Lagos Island",
    address: "123 Marina Street, Lagos Island, Lagos",
    distance: "2.5 km from city center",
    fuelType: "Petrol",
    transmission: "Automatic",
    year: 2022,
    mileage: "45,000 km",
    fuelConsumption: "6.5L/100km",
    verified: true,
    instantBook: true,
    description:
      "Experience comfort and reliability with our well-maintained Toyota Corolla 2022. Perfect for city driving and short trips. The car is regularly serviced and comes with comprehensive insurance coverage.",
    policies: {
      cancellation: "Free cancellation up to 24 hours before pickup",
      fuel: "Return with same fuel level",
      mileage: "Unlimited mileage within Lagos State",
      deposit: "₦50,000 security deposit required",
    },
    inclusions: [
      "Comprehensive insurance",
      "24/7 roadside assistance",
      "GPS navigation system",
      "Phone charger",
      "First aid kit",
    ],
    requirements: [
      "Valid Nigerian driver's license",
      "Minimum age: 21 years",
      "Credit card for security deposit",
      "Valid ID (National ID, Passport, or Voter's Card)",
    ],
  }

  const reviews = [
    {
      id: 1,
      user: "Adebayo Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent service! The car was clean, well-maintained, and the pickup process was smooth. Highly recommended!",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      user: "Sarah Okafor",
      rating: 4,
      date: "1 month ago",
      comment:
        "Good car and reliable vendor. The car performed well during my 3-day rental. Minor issue with the AC but was quickly resolved.",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 3,
      user: "Michael Eze",
      rating: 5,
      date: "2 months ago",
      comment:
        "Perfect for my business trip. Professional service and the car was exactly as described. Will definitely rent again.",
      avatar: "/placeholder-user.jpg",
    },
  ]

  const similarCars = [
    {
      id: 2,
      name: "Honda Civic 2022",
      vendor: "Lagos Car Rentals",
      price: 16000,
      rating: 4.7,
      reviews: 89,
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 3,
      name: "Nissan Sentra 2021",
      vendor: "Reliable Rentals",
      price: 14000,
      rating: 4.6,
      reviews: 156,
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 4,
      name: "Hyundai Elantra 2022",
      vendor: "Premium Cars",
      price: 17000,
      rating: 4.8,
      reviews: 203,
      image: "/placeholder.svg?height=150&width=200",
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/search">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/" className="text-2xl font-bold text-blue-600">
                QADA.ng
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
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
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
                <Image
                  src={car.images[currentImageIndex] || "/placeholder.svg"}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {car.verified && <Badge className="bg-green-600">Verified</Badge>}
                  {car.instantBook && <Badge className="bg-blue-600">Instant Book</Badge>}
                </div>
                {car.originalPrice && car.originalPrice > car.price && (
                  <Badge className="absolute top-4 right-4 bg-red-600">
                    Save ₦{(car.originalPrice - car.price).toLocaleString()}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 border-2",
                      currentImageIndex === index ? "border-blue-600" : "border-transparent",
                    )}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${car.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{car.rating}</span>
                      <span className="ml-1">({car.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {car.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">₦{car.price.toLocaleString()}</div>
                  <div className="text-gray-500">per day</div>
                  {car.originalPrice && (
                    <div className="text-gray-400 line-through">₦{car.originalPrice.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-6">{car.description}</p>

              {/* Car Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">4 Seats</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{car.transmission}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{car.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{car.year}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Features & Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {car.inclusions.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Shield className="h-4 w-4 text-green-600 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {car.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {Object.entries(car.policies).map(([key, value]) => (
                        <div key={key}>
                          <h4 className="font-medium capitalize mb-1">{key.replace(/([A-Z])/g, " $1")}</h4>
                          <p className="text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Guest Reviews</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">{car.rating}</span>
                      <span className="ml-1 text-gray-500">({car.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {review.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{review.user}</h4>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-2">
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
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Pickup Location</h4>
                        <p className="text-gray-600">{car.address}</p>
                        <p className="text-sm text-gray-500">{car.distance}</p>
                      </div>
                      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Map would be integrated here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Vendor Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Vendor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={car.vendor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {car.vendor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{car.vendor.name}</h3>
                      {car.vendor.verified && <Badge className="bg-green-600 text-xs">Verified</Badge>}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {car.vendor.rating} ({car.vendor.reviews} reviews)
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {car.vendor.responseTime}
                      </div>
                      <span>Joined {car.vendor.joinedDate}</span>
                    </div>
                    <div className="flex space-x-2">
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
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>₦{car.price.toLocaleString()}</span>
                  <span className="text-sm font-normal text-gray-500">per day</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Pickup Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !pickupDate && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "MMM dd") : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Return Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !returnDate && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {returnDate ? format(returnDate, "MMM dd") : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>₦{car.price.toLocaleString()} x 3 days</span>
                    <span>₦{(car.price * 3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₦2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance</span>
                    <span>₦5,000</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{(car.price * 3 + 2500 + 5000).toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Reserve (Pay Later)
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet. Free cancellation up to 24 hours before pickup.
                </p>
              </CardContent>
            </Card>

            {/* Similar Cars */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Similar Cars</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarCars.map((similarCar) => (
                  <Link key={similarCar.id} href={`/cars/${similarCar.id}`}>
                    <div className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Image
                        src={similarCar.image || "/placeholder.svg"}
                        alt={similarCar.name}
                        width={80}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{similarCar.name}</h4>
                        <p className="text-xs text-gray-500">{similarCar.vendor}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1">{similarCar.rating}</span>
                          </div>
                          <span className="font-semibold text-sm">₦{similarCar.price.toLocaleString()}/day</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
