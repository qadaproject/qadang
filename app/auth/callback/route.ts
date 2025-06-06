import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(new URL("/auth/login?error=callback_error", request.url))
      }

      if (data.user) {
        // Update email verification status
        const userType = searchParams.get("type") || "customer"
        const table = userType === "customer" ? "users" : userType === "vendor" ? "vendors" : "admins"

        await supabase
          .from(table)
          .update({
            email_verified: true,
            email_verified_at: new Date().toISOString(),
          })
          .eq("id", data.user.id)

        // Redirect to appropriate dashboard based on user type
        let redirectUrl = "/"
        if (userType === "vendor") {
          redirectUrl = "/vendor-dashboard"
        } else if (userType === "admin") {
          redirectUrl = "/admin"
        } else {
          redirectUrl = "/profile"
        }

        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
    } catch (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(new URL("/auth/login?error=callback_error", request.url))
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
