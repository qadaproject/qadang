"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Car, MapPin, Star, Users, Fuel, Settings, Filter, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

interface CarResult {
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
  vendor_id: string
  vendors: {
    business_name: string
    rating: number
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([5000, 50000])
  const [sortBy, setSortBy] = useState("recommended")
  const [cars, setCars] = useState<CarResult[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    carTypes: [] as string[],
    transmission: [] as string[],
    features: [] as string[],
    rating: null as number | null,
  })

  const pickupLocation = searchParams.get("pickup_location") || ""
  const pickupDate = searchParams.get("pickup_date")
    ? format(parseISO(searchParams.get("pickup_date")!), "MMM dd")
    : format(new Date(), "MMM dd")
  const returnDate = searchParams.get("return_date")
    ? format(parseISO(searchParams.get("return_date")!), "MMM dd")
    : format(new Date(), "MMM dd")

  useEffect(() => {
    fetchCars()
  }, [searchParams, sortBy])

  const fetchCars = async () => {
    try {
      setLoading(true)

      let query = supabase
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

      // Apply location filter if provided
      if (pickupLocation) {
        query = query.ilike("location", `%${pickupLocation}%`)
      }

      // Apply vendor filter if provided
      const vendorId = searchParams.get("vendor")
      if (vendorId) {
        query = query.eq("vendor_id", vendorId)
      }

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          query = query.order("price_per_day", { ascending: true })
          break
        case "price-high":
          query = query.order("price_per_day", { ascending: false })
          break
        case "rating":
          query = query.order("rating", { ascending: false })
          break
        default:
          query = query.order("rating", { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      setCars(data || [])
    } catch (error) {
      console.error("Error fetching cars:", error)
      // Fallback data
      setCars([
        {
          id: "1",
          name: "Toyota Corolla 2022",
          brand: "Toyota",
          model: "Corolla",
          year: 2022,
          price_per_day: 15000,
          transmission: "Automatic",
          fuel_type: "Petrol",
          seats: 5,
          features: ["Automatic", "AC", "Bluetooth", "USB Port"],
          images: ["/placeholder.svg?height=200&width=300"],
          location: "Lagos Island",
          address: "123 Marina Street, Lagos Island",
          rating: 4.8,
          total_bookings: 124,
          vendor_id: "1",
          vendors: {
            business_name: "Lagos Car Rentals",
            rating: 4.8,
          },
        },
        {
          id: "2",
          name: "Honda Accord 2023",
          brand: "Honda",
          model: "Accord",
          year: 2023,
          price_per_day: 25000,
          transmission: "Automatic",
          fuel_type: "Petrol",
          seats: 5,
          features: ["Automatic", "AC", "GPS", "Leather Seats"],
          images: ["/placeholder.svg?height=200&width=300"],
          location: "Wuse 2, Abuja",
          address: "45 Ademola Adetokunbo Crescent, Wuse 2",
          rating: 4.9,
          total_bookings: 89,
          vendor_id: "2",
          vendors: {
            business_name: "Abuja Premium Cars",
            rating: 4.9,
          },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (car: CarResult) => {
    // Price filter
    if (car.price_per_day < priceRange[0] || car.price_per_day > priceRange[1]) {
      return false
    }

    // Car type filter
    if (filters.carTypes.length > 0) {
      const carType = getCarType(car)
      if (!filters.carTypes.includes(carType)) {
        return false
      }
    }

    // Transmission filter
    if (filters.transmission.length > 0 && !filters.transmission.includes(car.transmission.toLowerCase())) {
      return false
    }

    // Features filter
    if (filters.features.length > 0) {
      const hasAllFeatures = filters.features.every((feature) =>
        car.features.some((carFeature) => carFeature.toLowerCase().includes(feature.toLowerCase())),
      )
      if (!hasAllFeatures) {
        return false
      }
    }

    // Rating filter
    if (filters.rating && car.rating < filters.rating) {
      return false
    }

    return true
  }

  const getCarType = (car: CarResult) => {
    const model = car.model.toLowerCase()
    if (model.includes("suv") || model.includes("crossover")) return "suv"
    if (model.includes("sedan")) return "sedan"
    if (model.includes("hatchback")) return "hatchback"
    if (model.includes("pickup") || model.includes("truck")) return "pickup"
    if (model.includes("van") || model.includes("minivan")) return "van"
    if (model.includes("luxury") || car.price_per_day > 40000) return "luxury"
    if (car.price_per_day < 15000) return "economy"
    return "mid-size"
  }

  const filteredCars = cars.filter(applyFilters)

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

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Car Type</h3>
        <div className="space-y-2">
          {["Economy", "Mid-size", "Full-size", "SUV", "Luxury", "Van"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.carTypes.includes(type.toLowerCase())}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      carTypes: [...filters.carTypes, type.toLowerCase()],
                    })
                  } else {
                    setFilters({
                      ...filters,
                      carTypes: filters.carTypes.filter((t) => t !== type.toLowerCase()),
                    })
                  }
                }}
              />
              <Label htmlFor={`type-${type}`} className="text-sm">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Transmission</h3>
        <div className="space-y-2">
          {["Automatic", "Manual"].map((trans) => (
            <div key={trans} className="flex items-center space-x-2">
              <Checkbox
                id={`trans-${trans}`}
                checked={filters.transmission.includes(trans.toLowerCase())}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      transmission: [...filters.transmission, trans.toLowerCase()],
                    })
                  } else {
                    setFilters({
                      ...filters,
                      transmission: filters.transmission.filter((t) => t !== trans.toLowerCase()),
                    })
                  }
                }}
              />
              <Label htmlFor={`trans-${trans}`} className="text-sm">
                {trans}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Features</h3>
        <div className="space-y-2">
          {["Air Conditioning", "GPS Navigation", "Bluetooth", "USB Port", "Leather Seats"].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={`feature-${feature}`}
                checked={filters.features.includes(feature.toLowerCase())}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      features: [...filters.features, feature.toLowerCase()],
                    })
                  } else {
                    setFilters({
                      ...filters,
                      features: filters.features.filter((f) => f !== feature.toLowerCase()),
                    })
                  }
                }}
              />
              <Label htmlFor={`feature-${feature}`} className="text-sm">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Vendor Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      rating,
                    })
                  } else {
                    setFilters({
                      ...filters,
                      rating: null,
                    })
                  }
                }}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                {rating}+ <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const CarCard = ({ car, isListView = false }: { car: CarResult; isListView?: boolean }) => (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isListView ? "flex" : ""}`}>
      <div className={`relative ${isListView ? "w-64 flex-shrink-0" : ""}`}>
        <Image
          src={car.images?.[0] || "/placeholder.svg?height=200&width=300"}
          alt={car.name}
          width={300}
          height={200}
          className={`object-cover ${isListView ? "w-full h-full" : "w-full h-48"}`}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge className="bg-green-600 text-xs">Verified</Badge>
          <Badge className="bg-blue-600 text-xs">Instant Book</Badge>
        </div>
      </div>

      <CardContent className={`p-4 ${isListView ? "flex-1" : ""}`}>
        <div className={`${isListView ? "flex justify-between items-start" : ""}`}>
          <div className={isListView ? "flex-1" : ""}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{car.name}</h3>
              {!isListView && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0071c2]">₦{car.price_per_day.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">per day</div>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-2">{car.vendors?.business_name}</p>

            <div className="flex items-center mb-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{car.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({car.total_bookings} bookings)</span>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              {car.location}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {car.features?.slice(0, isListView ? 6 : 4).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {car.features && car.features.length > (isListView ? 6 : 4) && (
                <Badge variant="secondary" className="text-xs">
                  +{car.features.length - (isListView ? 6 : 4)} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Fuel className="h-4 w-4 mr-1" />
                {car.fuel_type}
              </div>
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                {car.transmission}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {car.seats} seats
              </div>
            </div>
          </div>

          {isListView && (
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-[#0071c2]">₦{car.price_per_day.toLocaleString()}</div>
              <div className="text-sm text-gray-500">per day</div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/cars/${car.id}`} className="flex-1">
            <Button className="w-full bg-[#0071c2] hover:bg-[#005999]">View Details</Button>
          </Link>
          <Button variant="outline" className="flex-1">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-[#003087] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Car rentals in {pickupLocation || "Nigeria"}</h1>
          <SearchForm />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredCars.length} cars found {pickupLocation ? `in ${pickupLocation}` : ""}
            </h2>
            <p className="text-gray-600">
              {pickupDate} - {returnDate}
            </p>
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn("rounded-r-none", viewMode === "grid" ? "bg-[#0071c2] hover:bg-[#005999]" : "")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn("rounded-l-none", viewMode === "list" ? "bg-[#0071c2] hover:bg-[#005999]" : "")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

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
            {loading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className={`overflow-hidden animate-pulse ${viewMode === "list" ? "flex" : ""}`}>
                    <div className={`${viewMode === "list" ? "w-64 h-auto" : "h-48"} bg-gray-200`} />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                      <div className="h-3 bg-gray-200 rounded mb-3 w-1/2" />
                      <div className="h-3 bg-gray-200 rounded mb-4 w-1/4" />
                      <div className="flex gap-2 mb-4">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-6 bg-gray-200 rounded w-16" />
                        ))}
                      </div>
                      <div className="h-10 bg-gray-200 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} isListView={viewMode === "list"} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <Button
                  onClick={() => {
                    setPriceRange([5000, 50000])
                    setFilters({
                      carTypes: [],
                      transmission: [],
                      features: [],
                      rating: null,
                    })
                  }}
                  className="bg-[#0071c2] hover:bg-[#005999]"
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {filteredCars.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
