"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Car } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerificationPage() {
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  useEffect(() => {
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
  }, [])

  const handleResendVerification = async () => {
    // Reset countdown
    setCountdown(60)
    setCanResend(false)

    // TODO: Implement resend verification logic
    console.log("Resending verification to:", email)
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
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-gray-600">
              Please click the link in your email to verify your account. If you don't see the email, check your spam
              folder.
            </p>

            <div className="py-4">
              <Button variant="outline" className="w-full" disabled={!canResend} onClick={handleResendVerification}>
                {canResend ? "Resend verification email" : `Resend in ${countdown}s`}
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Already verified?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
