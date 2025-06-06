"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown, Globe, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

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

  return (
    <header className="bg-[#003087] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            QADA.ng
          </Link>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Yoruba</DropdownMenuItem>
                <DropdownMenuItem>Hausa</DropdownMenuItem>
                <DropdownMenuItem>Igbo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Currency Selector */}
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

            {/* User Profile / Sign In */}
            {!mounted || loading ? (
              <Skeleton className="h-9 w-9 rounded-full bg-white/20" />
            ) : user && profile ? (
              // Logged in state
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0 text-white hover:bg-white/20">
                    <Avatar className="h-9 w-9 border border-white/30">
                      <AvatarImage src={profile.profile_image || ""} alt="Profile" />
                      <AvatarFallback className="bg-blue-500 text-white">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {profile.first_name
                          ? `${profile.first_name} ${profile.last_name || ""}`
                          : profile.email.split("@")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Logged out state
              <Link href="/auth/login">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
