"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyPayment } from "@/lib/paystack"
import { supabase } from "@/lib/supabase"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    const reference = searchParams.get("reference")
    if (reference) {
      verifyPaymentStatus(reference)
    } else {
      setStatus("failed")
      setMessage("Invalid payment reference")
    }
  }, [searchParams])

  const verifyPaymentStatus = async (reference: string) => {
    try {
      const response = await verifyPayment(reference)

      if (response.status && response.data.status === "success") {
        // Payment successful, update database
        const metadata = response.data.metadata

        if (metadata.type === "wallet_funding") {
          // Handle wallet funding
          await handleWalletFunding(metadata.user_id, response.data.amount / 100, reference)
        } else if (metadata.booking_id) {
          // Handle booking payment
          await handleBookingPayment(metadata.booking_id, reference)
          setBookingId(metadata.booking_id)
        }

        setStatus("success")
        setMessage("Payment completed successfully!")
      } else {
        setStatus("failed")
        setMessage("Payment verification failed")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setStatus("failed")
      setMessage("Error verifying payment")
    }
  }

  const handleWalletFunding = async (userId: string, amount: number, reference: string) => {
    try {
      // Update wallet transaction status
      await supabase
        .from("wallet_transactions")
        .update({ status: "completed" })
        .eq("reference", reference)
        .eq("user_id", userId)

      // Update user wallet balance
      const { data: userData } = await supabase.from("users").select("wallet_balance").eq("id", userId).single()

      await supabase
        .from("users")
        .update({
          wallet_balance: (userData?.wallet_balance || 0) + amount,
        })
        .eq("id", userId)
    } catch (error) {
      console.error("Error updating wallet:", error)
    }
  }

  const handleBookingPayment = async (bookingId: string, reference: string) => {
    try {
      // Update booking payment status
      await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
        })
        .eq("id", bookingId)

      // Get booking details to award reward points
      const { data: booking } = await supabase
        .from("bookings")
        .select("user_id, total_amount")
        .eq("id", bookingId)
        .single()

      if (booking) {
        // Award reward points (1 point per ₦100)
        const points = Math.floor(booking.total_amount / 100)

        await supabase.from("reward_transactions").insert({
          user_id: booking.user_id,
          type: "earned",
          points,
          description: `Booking payment - ${points} points earned`,
          booking_id: bookingId,
        })

        // Update user's reward points
        const { data: userData } = await supabase
          .from("users")
          .select("reward_points")
          .eq("id", booking.user_id)
          .single()

        await supabase
          .from("users")
          .update({
            reward_points: (userData?.reward_points || 0) + points,
          })
          .eq("id", booking.user_id)
      }
    } catch (error) {
      console.error("Error updating booking:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {status === "loading" && <Loader2 className="h-6 w-6 animate-spin text-amber-500" />}
            {status === "success" && <CheckCircle className="h-6 w-6 text-green-500" />}
            {status === "failed" && <XCircle className="h-6 w-6 text-red-500" />}
            <span>
              {status === "loading" && "Processing Payment..."}
              {status === "success" && "Payment Successful!"}
              {status === "failed" && "Payment Failed"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>

          {status === "success" && (
            <div className="space-y-3">
              {bookingId ? (
                <div className="space-y-2">
                  <Link href={`/booking/success/${bookingId}`}>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">View Booking Details</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/wallet">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">View Wallet</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {status === "failed" && (
            <div className="space-y-2">
              <Button onClick={() => router.back()} variant="outline" className="w-full">
                Try Again
              </Button>
              <Link href="/">
                <Button variant="ghost" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          )}

          {status === "loading" && <p className="text-sm text-gray-500">Please wait while we verify your payment...</p>}
        </CardContent>
      </Card>
    </div>
  )
}
