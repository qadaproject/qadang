import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  if (!session) {
    const url = new URL("/auth/login", req.url)
    url.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // For role-based access control
  if (req.nextUrl.pathname.startsWith("/vendor-dashboard")) {
    // Check if user is a vendor
    const { data: vendor } = await supabase.from("vendors").select("id").eq("id", session.user.id).single()

    if (!vendor) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Check if user is an admin
    const { data: admin } = await supabase.from("admins").select("id").eq("id", session.user.id).single()

    if (!admin) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/profile/:path*", "/vendor-dashboard/:path*", "/admin/:path*", "/booking/:path*", "/wallet/:path*"],
}
