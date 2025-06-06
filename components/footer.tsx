import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#003087]">Car Rental</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-gray-600 hover:text-[#003087]">
                  Car rental in Lagos
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-[#003087]">
                  Car rental in Abuja
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-[#003087]">
                  Car rental in Port Harcourt
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-[#003087]">
                  Car rental in Kano
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-[#003087]">
                  Car rental in Ibadan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#003087]">Popular Car Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search?type=suv" className="text-gray-600 hover:text-[#003087]">
                  SUV Rentals
                </Link>
              </li>
              <li>
                <Link href="/search?type=luxury" className="text-gray-600 hover:text-[#003087]">
                  Luxury Car Rentals
                </Link>
              </li>
              <li>
                <Link href="/search?type=economy" className="text-gray-600 hover:text-[#003087]">
                  Economy Car Rentals
                </Link>
              </li>
              <li>
                <Link href="/search?type=pickup" className="text-gray-600 hover:text-[#003087]">
                  Pickup Truck Rentals
                </Link>
              </li>
              <li>
                <Link href="/search?type=van" className="text-gray-600 hover:text-[#003087]">
                  Van Rentals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#003087]">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-[#003087]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#003087]">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#003087]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#003087]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#003087]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#003087]">About QADA.ng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#003087]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/vendor-dashboard" className="text-gray-600 hover:text-[#003087]">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-[#003087]">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-[#003087]">
                  Press Center
                </Link>
              </li>
              <li>
                <Link href="/investor-relations" className="text-gray-600 hover:text-[#003087]">
                  Investor Relations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} QADA.ng. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-[#003087]">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-[#003087]">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-[#003087]">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-[#003087]">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
