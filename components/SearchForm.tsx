"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function SearchForm() {
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("Fri, 6 Jun")
  const [dropoffDate, setDropoffDate] = useState("Mon, 9 Jun")
  const [pickupTime, setPickupTime] = useState("10:00")
  const [dropoffTime, setDropoffTime] = useState("10:00")
  const [differentDropoff, setDifferentDropoff] = useState(false)
  const [driverAge, setDriverAge] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams({
      pickup_location: pickupLocation,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      dropoff_date: dropoffDate,
      dropoff_time: dropoffTime,
      driver_age: driverAge ? "yes" : "no",
    })

    if (differentDropoff && dropoffLocation) {
      params.append("dropoff_location", dropoffLocation)
    }

    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-md">
      <div className="space-y-4">
        {/* Pickup Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <MapPin className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Pick-up location"
            className="w-full pl-10 pr-3 py-3 text-black yellow-border rounded-md focus:outline-none"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
          />
        </div>

        {/* Pickup Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Calendar className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Pick-up date"
              className="w-full pl-10 pr-3 py-3 text-black yellow-border rounded-md focus:outline-none"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Clock className="h-5 w-5" />
            </div>
            <select
              className="w-full pl-10 pr-8 py-3 text-black yellow-border rounded-md focus:outline-none appearance-none"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
            >
              <option value="10:00">10:00</option>
              <option value="10:30">10:30</option>
              <option value="11:00">11:00</option>
              <option value="11:30">11:30</option>
              <option value="12:00">12:00</option>
              <option value="12:30">12:30</option>
              <option value="13:00">13:00</option>
              <option value="13:30">13:30</option>
              <option value="14:00">14:00</option>
              <option value="14:30">14:30</option>
              <option value="15:00">15:00</option>
              <option value="15:30">15:30</option>
              <option value="16:00">16:00</option>
              <option value="16:30">16:30</option>
              <option value="17:00">17:00</option>
              <option value="17:30">17:30</option>
              <option value="18:00">18:00</option>
            </select>
          </div>
        </div>

        {/* Dropoff Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Calendar className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Drop-off date"
              className="w-full pl-10 pr-3 py-3 text-black yellow-border rounded-md focus:outline-none"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Clock className="h-5 w-5" />
            </div>
            <select
              className="w-full pl-10 pr-8 py-3 text-black yellow-border rounded-md focus:outline-none appearance-none"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              required
            >
              <option value="10:00">10:00</option>
              <option value="10:30">10:30</option>
              <option value="11:00">11:00</option>
              <option value="11:30">11:30</option>
              <option value="12:00">12:00</option>
              <option value="12:30">12:30</option>
              <option value="13:00">13:00</option>
              <option value="13:30">13:30</option>
              <option value="14:00">14:00</option>
              <option value="14:30">14:30</option>
              <option value="15:00">15:00</option>
              <option value="15:30">15:30</option>
              <option value="16:00">16:00</option>
              <option value="16:30">16:30</option>
              <option value="17:00">17:00</option>
              <option value="17:30">17:30</option>
              <option value="18:00">18:00</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-[#0052d4] hover:bg-[#003087] text-white font-semibold py-3 px-4 rounded-md transition-colors"
        >
          Search
        </button>

        {/* Options */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="different-location"
              checked={differentDropoff}
              onCheckedChange={(checked) => setDifferentDropoff(checked as boolean)}
            />
            <Label htmlFor="different-location" className="text-black">
              Drop car off at different location
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="driver-age"
              checked={driverAge}
              onCheckedChange={(checked) => setDriverAge(checked as boolean)}
            />
            <Label htmlFor="driver-age" className="text-black">
              Driver aged 30 – 65?
            </Label>
          </div>
        </div>
      </div>
    </form>
  )
}
