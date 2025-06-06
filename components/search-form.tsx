"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const timeOptions = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
]

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function SearchForm() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date>(new Date())
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 3))
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnTime, setReturnTime] = useState("10:00")
  const [differentDropoff, setDifferentDropoff] = useState(false)
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [driverAge, setDriverAge] = useState(true)
  const [predictions, setPredictions] = useState<any[]>([])
  const [showPredictions, setShowPredictions] = useState(false)

  const autocompleteService = useRef<any>(null)
  const placesService = useRef<any>(null)

  useEffect(() => {
    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&libraries=places&callback=initMap`
      script.async = true
      script.defer = true

      window.initMap = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
        placesService.current = new window.google.maps.places.PlacesService(document.createElement("div"))
      }

      document.head.appendChild(script)
    } else {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
      placesService.current = new window.google.maps.places.PlacesService(document.createElement("div"))
    }
  }, [])

  const handleLocationChange = (value: string) => {
    setLocation(value)

    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "ng" }, // Restrict to Nigeria
          types: ["(cities)"],
        },
        (predictions: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions)
            setShowPredictions(true)
          }
        },
      )
    } else {
      setPredictions([])
      setShowPredictions(false)
    }
  }

  const selectLocation = (prediction: any) => {
    setLocation(prediction.description)
    setShowPredictions(false)
    setPredictions([])
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const searchParams = new URLSearchParams()
    searchParams.set("pickup_location", location)
    searchParams.set("pickup_date", pickupDate.toISOString())
    searchParams.set("pickup_time", pickupTime)
    searchParams.set("return_date", returnDate.toISOString())
    searchParams.set("return_time", returnTime)

    if (differentDropoff && dropoffLocation) {
      searchParams.set("dropoff_location", dropoffLocation)
    }

    searchParams.set("driver_age_verified", driverAge.toString())

    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-md shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pickup Location */}
        <div className="md:col-span-2 relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Pick-up location"
              className="pl-10 h-12 border-2 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500 text-black placeholder:text-gray-500"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={() => setShowPredictions(predictions.length > 0)}
              required
            />
          </div>

          {/* Google Places Predictions */}
          {showPredictions && predictions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {predictions.map((prediction, index) => (
                <div
                  key={prediction.place_id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => selectLocation(prediction)}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-black">{prediction.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pickup Date */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 border-2 border-yellow-400 hover:border-yellow-500 text-black",
                      !pickupDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {pickupDate ? (
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500">Pick-up date</span>
                        <span className="text-black">{format(pickupDate, "E, d MMM")}</span>
                      </div>
                    ) : (
                      <span>Pick a date</span>
                    )}
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
              <Select value={pickupTime} onValueChange={setPickupTime}>
                <SelectTrigger className="h-12 border-2 border-yellow-400 hover:border-yellow-500 text-black">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500">Time</span>
                      <SelectValue placeholder="Select time" />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Return Date */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 border-2 border-yellow-400 hover:border-yellow-500 text-black",
                      !returnDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {returnDate ? (
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500">Drop-off date</span>
                        <span className="text-black">{format(returnDate, "E, d MMM")}</span>
                      </div>
                    ) : (
                      <span>Pick a date</span>
                    )}
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
            <div>
              <Select value={returnTime} onValueChange={setReturnTime}>
                <SelectTrigger className="h-12 border-2 border-yellow-400 hover:border-yellow-500 text-black">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500">Time</span>
                      <SelectValue placeholder="Select time" />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2">
          <Button type="submit" className="w-full bg-[#0071c2] hover:bg-[#005999] text-white h-12">
            Search
          </Button>
        </div>

        {/* Checkboxes */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="different-location"
              checked={differentDropoff}
              onCheckedChange={(checked) => setDifferentDropoff(checked as boolean)}
            />
            <Label htmlFor="different-location" className="text-sm text-black">
              Drop car off at different location
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="driver-age"
              checked={driverAge}
              onCheckedChange={(checked) => setDriverAge(checked as boolean)}
            />
            <Label htmlFor="driver-age" className="text-sm text-black">
              Driver aged 30 – 65?
            </Label>
          </div>
        </div>

        {/* Different Dropoff Location */}
        {differentDropoff && (
          <div className="md:col-span-2 mt-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Drop-off location"
                className="pl-10 h-12 border-2 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500 text-black placeholder:text-gray-500"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                required={differentDropoff}
              />
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
