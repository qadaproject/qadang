"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Star, Users, Fuel, Settings, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([10000, 50000])

  const searchResults = [
    {
      id: 1,
      name: "Toyota Corolla 2022",
      vendor: "Lagos Car Rentals",
      price: 15000,
      originalPrice: 18000,
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg?height=200&width=300",
      features: ["Automatic", "AC", "4 Seats", "Bluetooth"],
      location: "Lagos Island",
      distance: "2.5 km from center",
      fuelType: "Petrol",
      transmission: "Automatic",
      verified: true,
      instantBook: true,
    },
    {
      id: 2,
      name: "Honda Accord 2023",
      vendor: "Abuja Premium Cars",
      price: 25000,
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg?height=200&width=300",
      features: ["Automatic", "AC", "5 Seats", "GPS"],
      location: "Wuse 2",
      distance: "1.2 km from center",
      fuelType: "Petrol",
      transmission: "Automatic",
      verified: true,
      instantBook: false,
    },
    {
      id: 3,
      name: "Hyundai Elantra 2022",
      vendor: "Port Harcourt Rentals",
      price: 18000,
      rating: 4.7,
      reviews: 156,
      image: "/placeholder.svg?height=200&width=300",
      features: ["Manual", "AC", "5 Seats", "USB"],
      location: "GRA Phase 1",
      distance: "3.1 km from center",
      fuelType: "Petrol",
      transmission: "Manual",
      verified: true,
      instantBook: true,
    },
    {
      id: 4,
      name: "Kia Picanto 2021",
      vendor: "Budget Cars Nigeria",
      price: 12000,
      rating: 4.5,
      reviews: 203,
      image: "/placeholder.svg?height=200&width=300",
      features: ["Manual", "AC", "4 Seats"],
      location: "Ikeja",
      distance: "5.2 km from center",
      fuelType: "Petrol",
      transmission: "Manual",
      verified: true,
      instantBook: true,
    },
    {
      id: 5,
      name: "Mercedes C-Class 2023",
      vendor: "Luxury Rides Lagos",
      price: 45000,
      rating: 4.9,
      reviews: 67,
      image: "/placeholder.svg?height=200&width=300",
      features: ["Automatic", "AC", "5 Seats", "Leather", "GPS", "Bluetooth"],
      location: "Victoria Island",
      distance: "1.8 km from center",
      fuelType: "Petrol",
      transmission: "Automatic",
      verified: true,
      instantBook: false,
    },
    {
      id: 6,
      name: "Nissan Sentra 2022",
      vendor: "Reliable Rentals",
      price: 16000,
      rating: 4.6,
      reviews: 98,
      image: "/placeholder.svg?height=200&width=300",
      features: ["Automatic", "AC", "5 Seats", "Bluetooth"],
      location: "Surulere",
      distance: "4.3 km from center",
      fuelType: "Petrol",
      transmission: "Automatic",
      verified: true,
      instantBook: true,
    },
  ]

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Range (per day)</h3>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100000}
            min={5000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Car Type</h3>
        <div className="space-y-2">
          {["Economy", "Compact", "Mid-size", "Full-size", "Luxury", "SUV"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} />
              <label htmlFor={type} className="text-sm">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Transmission</h3>
        <div className="space-y-2">
          {["Automatic", "Manual"].map((trans) => (
            <div key={trans} className="flex items-center space-x-2">
              <Checkbox id={trans} />
              <label htmlFor={trans} className="text-sm">
                {trans}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Features</h3>
        <div className="space-y-2">
          {["Air Conditioning", "GPS Navigation", "Bluetooth", "USB Port", "Leather Seats"].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox id={feature} />
              <label htmlFor={feature} className="text-sm">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Vendor Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                {rating}+ <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const CarCard = ({ car, isListView = false }: { car: (typeof searchResults)[0]; isListView?: boolean }) => (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isListView ? "flex" : ""}`}>
      <div className={`relative ${isListView ? "w-64 flex-shrink-0" : ""}`}>
        <Image
          src={car.image || "/placeholder.svg"}
          alt={car.name}
          width={300}
          height={200}
          className={`object-cover ${isListView ? "w-full h-full" : "w-full h-48"}`}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {car.verified && <Badge className="bg-green-600 text-xs">Verified</Badge>}
          {car.instantBook && <Badge className="bg-blue-600 text-xs">Instant Book</Badge>}
        </div>
        {car.originalPrice && car.originalPrice > car.price && (
          <Badge className="absolute top-3 right-3 bg-red-600 text-xs">
            Save ₦{(car.originalPrice - car.price).toLocaleString()}
          </Badge>
        )}
      </div>

      <CardContent className={`p-4 ${isListView ? "flex-1" : ""}`}>
        <div className={`${isListView ? "flex justify-between items-start" : ""}`}>
          <div className={isListView ? "flex-1" : ""}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{car.name}</h3>
              {!isListView && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">₦{car.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">per day</div>
                  {car.originalPrice && (
                    <div className="text-sm text-gray-400 line-through">₦{car.originalPrice.toLocaleString()}</div>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-2">{car.vendor}</p>

            <div className="flex items-center mb-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{car.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({car.reviews} reviews)</span>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              {car.location} • {car.distance}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {car.features.slice(0, isListView ? 6 : 4).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {car.features.length > (isListView ? 6 : 4) && (
                <Badge variant="secondary" className="text-xs">
                  +{car.features.length - (isListView ? 6 : 4)} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Fuel className="h-4 w-4 mr-1" />
                {car.fuelType}
              </div>
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                {car.transmission}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {car.features.find((f) => f.includes("Seats"))?.replace(" Seats", "") || "5"} seats
              </div>
            </div>
          </div>

          {isListView && (
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-blue-600">₦{car.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500">per day</div>
              {car.originalPrice && (
                <div className="text-sm text-gray-400 line-through">₦{car.originalPrice.toLocaleString()}</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/cars/${car.id}`} className="flex-1">
            <Button className="w-full">View Details</Button>
          </Link>
          {car.instantBook && (
            <Button variant="outline" className="flex-1">
              Book Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              QADA.ng
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input placeholder="Search by location, car model, or vendor..." className="w-full" />
              </div>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Lagos: {searchResults.length} cars found</h1>
                <p className="text-gray-600">Dec 15 - Dec 18 • 3 days</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Refine your search results</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select defaultValue="recommended">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {searchResults.map((car) => (
                <CarCard key={car.id} car={car} isListView={viewMode === "list"} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
