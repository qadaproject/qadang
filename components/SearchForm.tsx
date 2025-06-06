"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function SearchForm() {
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("Fri, 6 Jun")
  const [dropoffDate, setDropoffDate] = useState("Mon, 9 Jun")
  const [pickupTime, setPickupTime] = useState("10:00")
  const [dropoffTime, setDropoffTime] = useState("10:00")
  const [differentLocation, setDifferentLocation] = useState(false)
  const [driverAge, setDriverAge] = useState(true)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const searchParams = new URLSearchParams({
      pickup: pickupLocation,
      dropoff: differentLocation ? dropoffLocation : pickupLocation,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      driverAge: driverAge ? "true" : "false",
    })

    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        {/* Pickup Location */}
        <div className="relative">
          <div className="flex items-center border-2 border-yellow-400 rounded-lg p-3">
            <MapPin className="h-5 w-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Pick-up location"
              className="flex-1 outline-none text-black"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Dropoff Location (conditional) */}
        {differentLocation && (
          <div className="relative">
            <div className="flex items-center border-2 border-yellow-400 rounded-lg p-3">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Drop-off location"
                className="flex-1 outline-none text-black"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                required={differentLocation}
              />
            </div>
          </div>
        )}

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup Date */}
          <div className="relative">
            <div className="flex items-center border-2 border-yellow-400 rounded-lg p-3">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-500">Pick-up date</span>
                <input
                  type="text"
                  className="outline-none text-black"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Pickup Time */}
          <div className="relative">
            <div className="flex items-center border-2 border-yellow-400 rounded-lg p-3">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-500">Time</span>
                <input
                  type="text"
                  className="outline-none text-black"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Dropoff Date */}
          <div className="relative">
            <div className="flex items-center border-2 border-yellow-400 rounded-lg p-3">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-500">Drop-off date</span>
                <input
                  type="text"
                  className="outline-none text-black"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Dropoff Time */}
          <div className="relative">
            <div className="flex items-center border-2 border-yellow-400 rounded-lg p-3">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-500">Time</span>
                <input
                  type="text"
                  className="outline-none text-black"
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
          Search
        </Button>

        {/* Options */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="different-location"
              checked={differentLocation}
              onCheckedChange={(checked) => setDifferentLocation(checked === true)}
            />
            <label htmlFor="different-location" className="text-sm text-black">
              Drop car off at different location
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="driver-age"
              checked={driverAge}
              onCheckedChange={(checked) => setDriverAge(checked === true)}
            />
            <label htmlFor="driver-age" className="text-sm text-black">
              Driver aged 30 – 65?
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
