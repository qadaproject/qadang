"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Car, Bed, Plane, MapPin, CarTaxiFrontIcon as Taxi, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Stays", href: "/stays", icon: Bed },
  { name: "Flights", href: "/flights", icon: Plane },
  { name: "Car rentals", href: "/", icon: Car, active: true },
  { name: "Attractions", href: "/attractions", icon: MapPin },
  { name: "Airport taxis", href: "/taxis", icon: Taxi },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-[#003087] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            QADA.ng
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-full text-sm font-medium",
                  (item.href === pathname || (item.href === "/" && pathname === "/")) && "bg-white/10",
                  "hover:bg-white/20 transition-colors",
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  NGN
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>NGN - Nigerian Naira</DropdownMenuItem>
                <DropdownMenuItem>USD - US Dollar</DropdownMenuItem>
                <DropdownMenuItem>GBP - British Pound</DropdownMenuItem>
                <DropdownMenuItem>EUR - Euro</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/auth/register">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#003087]">
                Register
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#003087]">
                Sign in
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm font-medium",
                  (item.href === pathname || (item.href === "/" && pathname === "/")) && "bg-white/10",
                  "hover:bg-white/20 transition-colors",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/20 mt-4 space-y-2">
              <Link href="/auth/register" className="block px-4 py-2">
                Register
              </Link>
              <Link href="/auth/login" className="block px-4 py-2">
                Sign in
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
