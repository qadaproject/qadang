"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, MapPin, Star, Shield, CreditCard, Headphones, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export default function HomePage() {
  const [pickupDate, setPickupDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [location, setLocation] = useState("")
  const [driverOption, setDriverOption] = useState("self-drive")
  const [featuredCars, setFeaturedCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedCars()
  }, [])

  const fetchFeaturedCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          vendors (
            business_name,
            rating
          )
        `)
        .eq("status", "active")
        .eq("is_available", true)
        .order("rating", { ascending: false })
        .limit(6)

      if (error) {
        console.error("Error fetching cars:", error)
        // Use fallback data if database is empty
        setFeaturedCars([])
      } else {
        setFeaturedCars(data || [])
      }
    } catch (error) {
      console.error("Error fetching featured cars:", error)
      setFeaturedCars([])
    } finally {
      setLoading(false)
    }
  }

  const popularDestinations = [
    { name: "Lagos", cars: "2,500+ cars", image: "/placeholder.svg?height=150&width=200" },
    { name: "Abuja", cars: "1,800+ cars", image: "/placeholder.svg?height=150&width=200" },
    { name: "Port Harcourt", cars: "900+ cars", image: "/placeholder.svg?height=150&width=200" },
    { name: "Kano", cars: "600+ cars", image: "/placeholder.svg?height=150&width=200" },
    { name: "Ibadan", cars: "750+ cars", image: "/placeholder.svg?height=150&width=200" },
    { name: "Benin City", cars: "400+ cars", image: "/placeholder.svg?height=150&width=200" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-darkblue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold">
                QADA.ng
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/search" className="hover:text-skyblue-200 transition-colors">
                  Car Rentals
                </Link>
                <Link href="/vendor-dashboard" className="hover:text-skyblue-200 transition-colors">
                  Become a Vendor
                </Link>
                <Link href="/corporate" className="hover:text-skyblue-200 transition-colors">
                  Corporate
                </Link>
                <Link href="/support" className="hover:text-skyblue-200 transition-colors">
                  Support
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Select defaultValue="ngn">
                <SelectTrigger className="w-20 bg-transparent border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngn">₦ NGN</SelectItem>
                  <SelectItem value="usd">$ USD</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/vendor-dashboard" className="hover:text-skyblue-200 transition-colors">
                List your cars
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="text-darkblue-800 bg-white hover:bg-skyblue-50">
                  Register
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:bg-darkblue-700">
                  Sign in
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-darkblue-800 via-blue-700 to-skyblue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find the perfect car for any journey</h1>
            <p className="text-xl text-skyblue-100">
              From economy cars to luxury vehicles - discover, compare, and book car rentals across Nigeria
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-5xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="City or airport"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pickup Date</label>
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
                        {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Return Date</label>
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
                        {returnDate ? format(returnDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Driver Option</label>
                  <RadioGroup value={driverOption} onValueChange={setDriverOption} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self-drive" id="self-drive" />
                      <Label htmlFor="self-drive" className="text-sm">
                        Self Drive
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="with-driver" id="with-driver" />
                      <Label htmlFor="with-driver" className="text-sm">
                        With Driver
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Driver Age</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18-25 years</SelectItem>
                      <SelectItem value="26-65">26-65 years</SelectItem>
                      <SelectItem value="65+">65+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/search?location=${encodeURIComponent(location)}&pickup=${pickupDate?.toISOString()}&return=${returnDate?.toISOString()}&driver=${driverOption}`}
                >
                  <Button size="lg" className="w-full bg-darkblue-700 hover:bg-darkblue-800">
                    <Search className="mr-2 h-5 w-5" />
                    Search Cars
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-skyblue-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-skyblue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Book now, pay later</h3>
                <p className="text-gray-600 text-sm">Reserve your car with no upfront payment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">500+ verified vendors</h3>
                <p className="text-gray-600 text-sm">All vendors are KYC verified and insured</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Headphones className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">24/7 customer support</h3>
                <p className="text-gray-600 text-sm">We're always here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Cars</h2>
            <p className="text-gray-600">Popular choices from our verified vendors</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-3 w-2/3" />
                    <div className="h-3 bg-gray-200 rounded mb-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={car.images?.[0] || "/placeholder.svg?height=200&width=300"}
                      alt={car.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-600">Available</Badge>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-darkblue-600" />
                        <span className="text-xs font-medium">{car.transmission}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{car.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-darkblue-600">
                          ₦{car.price_per_day.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per day</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{car.vendors?.business_name}</p>
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{car.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({car.total_bookings} bookings)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features?.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {car.location}
                      </div>
                      <Link href={`/cars/${car.id}`}>
                        <Button size="sm" className="bg-darkblue-600 hover:bg-darkblue-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No cars available yet</h3>
              <p className="text-gray-600 mb-4">Be the first to add cars to our marketplace!</p>
              <Link href="/vendor-dashboard">
                <Button className="bg-darkblue-600 hover:bg-darkblue-700">Become a Vendor</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-gray-600">Explore car rentals in Nigeria's top cities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((destination, index) => (
              <Link key={index} href={`/search?location=${encodeURIComponent(destination.name)}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-semibold">{destination.name}</h3>
                      <p className="text-sm opacity-90">{destination.cars}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darkblue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">QADA.ng</h3>
              <p className="text-skyblue-200 mb-4">
                Nigeria's leading car rental marketplace. Find, compare, and book cars from verified vendors.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-skyblue-200 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-skyblue-200 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-skyblue-200">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-skyblue-200">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white transition-colors">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partners</h4>
              <ul className="space-y-2 text-skyblue-200">
                <li>
                  <Link href="/vendor-dashboard" className="hover:text-white transition-colors">
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate" className="hover:text-white transition-colors">
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API Access
                  </Link>
                </li>
                <li>
                  <Link href="/corporate" className="hover:text-white transition-colors">
                    Corporate Solutions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-darkblue-700 mt-8 pt-8 text-center text-skyblue-200">
            <p>&copy; 2024 QADA.ng. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
