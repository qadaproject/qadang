"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Vendor {
  id: string
  business_name: string
}

export function VendorLogos() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVendors() {
      try {
        const { data, error } = await supabase
          .from("vendors")
          .select("id, business_name")
          .eq("status", "approved")
          .order("total_bookings", { ascending: false })
          .limit(5)

        if (error) throw error
        setVendors(data || [])
      } catch (error) {
        console.error("Error fetching vendors:", error)
        // Fallback data
        setVendors([
          { id: "1", business_name: "Lagos Car Rentals" },
          { id: "2", business_name: "Abuja Premium Cars" },
          { id: "3", business_name: "Port Harcourt Rentals" },
          { id: "4", business_name: "Kano Motors" },
          { id: "5", business_name: "Ibadan Car Hire" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-md h-16 animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {vendors.map((vendor) => (
        <Link
          key={vendor.id}
          href={`/search?vendor=${vendor.id}`}
          className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-center hover:shadow-md transition-shadow min-h-[80px]"
        >
          <div className="text-center">
            <div className="font-semibold text-gray-800 text-sm">{vendor.business_name}</div>
            <div className="text-xs text-gray-500 mt-1">Car Rental</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
