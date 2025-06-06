"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Car, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { supabase, sendVerificationEmail } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [resending, setResending] = useState(false)

  const searchParams = useSearchParams()
  const userType = (searchParams.get("type") as "customer" | "vendor" | "admin") || "customer"
  const token = searchParams.get("token")
  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (token) {
      verifyEmailToken()
    } else {
      setStatus("error")
    }
  }, [token])

  useEffect(() => {
    if (status === "error" || status === "expired") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [status])

  const verifyEmailToken = async () => {
    try {
      // Verify the token in our database
      const { data: tokenData, error: tokenError } = await supabase
        .from("email_verification_tokens")
        .select("*")
        .eq("token", token)
        .eq("user_type", userType)
        .single()

      if (tokenError || !tokenData) {
        setStatus("error")
        return
      }

      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        setStatus("expired")
        return
      }

      // Check if token is already used
      if (tokenData.used_at) {
        setStatus("success")
        return
      }

      // Mark token as used
      await supabase
        .from("email_verification_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", tokenData.id)

      // Update user verification status
      const table = userType === "customer" ? "users" : userType === "vendor" ? "vendors" : "admins"
      await supabase
        .from(table)
        .update({
          email_verified: true,
          email_verified_at: new Date().toISOString(),
        })
        .eq("id", tokenData.user_id)

      setStatus("success")
    } catch (error) {
      console.error("Email verification error:", error)
      setStatus("error")
    }
  }

  const handleResendVerification = async () => {
    if (!email) return

    setResending(true)
    try {
      const result = await sendVerificationEmail(email, userType)
      if (result.success) {
        setCountdown(60)
        setCanResend(false)
      }
    } catch (error) {
      console.error("Resend verification error:", error)
    } finally {
      setResending(false)
    }
  }

  const getRedirectUrl = () => {
    switch (userType) {
      case "vendor":
        return "/vendor-dashboard"
      case "admin":
        return "/admin"
      default:
        return "/profile"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Car className="h-8 w-8 text-white" />
            <span className="text-3xl font-bold text-white">QADA.ng</span>
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              {status === "success" ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <AlertCircle className="h-16 w-16 text-orange-500" />
              )}
            </div>
            <CardTitle className="text-2xl text-center">
              {status === "loading" && "Verifying your email..."}
              {status === "success" && "Email verified successfully!"}
              {status === "error" && "Verification failed"}
              {status === "expired" && "Verification link expired"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === "loading" && "Please wait while we verify your email address."}
              {status === "success" && "Your email has been verified. You can now access your account."}
              {status === "error" && "The verification link is invalid or has already been used."}
              {status === "expired" && "The verification link has expired. Please request a new one."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {status === "success" && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                <Link href={getRedirectUrl()}>Continue to Dashboard</Link>
              </Button>
            )}

            {(status === "error" || status === "expired") && (
              <>
                {email && (
                  <div className="py-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!canResend || resending}
                      onClick={handleResendVerification}
                    >
                      {resending ? "Sending..." : canResend ? "Send new verification email" : `Resend in ${countdown}s`}
                    </Button>
                  </div>
                )}

                <p className="text-sm text-gray-600">
                  Need help?{" "}
                  <Link href="/auth/login" className="text-blue-600 hover:underline">
                    Back to login
                  </Link>
                </p>
              </>
            )}

            {status === "loading" && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
