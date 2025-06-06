"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Car,
  Bed,
  Plane,
  MapPin,
  CarTaxiFrontIcon as Taxi,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  CreditCard,
  Package,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

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
  const { user, profile, loading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profile) return "U"

    if (profile.role === "vendor" && profile.business_name) {
      return profile.business_name.substring(0, 2).toUpperCase()
    }

    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    }

    if (profile.email) {
      return profile.email[0].toUpperCase()
    }

    return "U"
  }

  // Get display name
  const getDisplayName = () => {
    if (!profile) return "User"

    if (profile.role === "vendor" && profile.business_name) {
      return profile.business_name
    }

    if (profile.first_name) {
      return profile.first_name
    }

    return profile.email.split("@")[0]
  }

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!profile) return "/dashboard"

    if (profile.role === "vendor") {
      return "/vendor-dashboard"
    } else if (profile.role === "admin") {
      return "/admin"
    } else {
      return "/dashboard"
    }
  }

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

            {/* Show loading skeleton during auth check */}
            {!mounted || loading ? (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-9 w-20 bg-white/20" />
                <Skeleton className="h-9 w-20 bg-white/20" />
              </div>
            ) : user && profile ? (
              // Logged in state
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/20 p-1">
                    <Avatar className="h-8 w-8 border border-white/30">
                      <AvatarImage src={profile.profile_image || ""} alt={getDisplayName()} />
                      <AvatarFallback className="bg-blue-500 text-white">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{getDisplayName()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {profile.role === "customer" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/bookings" className="flex items-center cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wallet" className="flex items-center cursor-pointer">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Wallet</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {profile.role === "vendor" && (
                    <DropdownMenuItem asChild>
                      <Link href="/vendor-dashboard/cars" className="flex items-center cursor-pointer">
                        <Car className="mr-2 h-4 w-4" />
                        <span>My Cars</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Logged out state
              <>
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
              </>
            )}
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

            {/* Mobile auth menu */}
            <div className="pt-4 border-t border-white/20 mt-4 space-y-2">
              {!mounted || loading ? (
                <Skeleton className="h-10 w-full bg-white/20" />
              ) : user && profile ? (
                <>
                  <div className="flex items-center px-4 py-2">
                    <Avatar className="h-8 w-8 mr-2 border border-white/30">
                      <AvatarImage src={profile.profile_image || ""} alt={getDisplayName()} />
                      <AvatarFallback className="bg-blue-500 text-white">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{getDisplayName()}</p>
                      <p className="text-xs opacity-70">{profile.email}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center px-4 py-2 text-red-300 w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/register" className="block px-4 py-2" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                  <Link href="/auth/login" className="block px-4 py-2" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
