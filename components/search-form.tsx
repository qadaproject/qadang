"use client"

import type React from "react"

import { useState } from "react"
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
        <div className="md:col-span-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Pick-up location"
              className="pl-10 h-12 border-2 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
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
                      "w-full justify-start text-left font-normal h-12 border-2 border-yellow-400 hover:border-yellow-500",
                      !pickupDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {pickupDate ? (
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500">Pick-up date</span>
                        <span>{format(pickupDate, "E, d MMM")}</span>
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
                <SelectTrigger className="h-12 border-2 border-yellow-400 hover:border-yellow-500">
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
                      "w-full justify-start text-left font-normal h-12 border-2 border-yellow-400 hover:border-yellow-500",
                      !returnDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {returnDate ? (
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500">Drop-off date</span>
                        <span>{format(returnDate, "E, d MMM")}</span>
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
                <SelectTrigger className="h-12 border-2 border-yellow-400 hover:border-yellow-500">
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
            <Label htmlFor="different-location" className="text-sm">
              Drop car off at different location
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="driver-age"
              checked={driverAge}
              onCheckedChange={(checked) => setDriverAge(checked as boolean)}
            />
            <Label htmlFor="driver-age" className="text-sm">
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
                className="pl-10 h-12 border-2 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500"
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
