import { type NextRequest, NextResponse } from "next/server"
import { verifyPayment } from "@/lib/paystack"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { reference: string } }) {
  try {
    const { reference } = params

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    const verification = await verifyPayment(reference)

    if (verification.status && verification.data.status === "success") {
      // Update booking status in database
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          payment_status: "completed",
          payment_reference: reference,
          updated_at: new Date().toISOString(),
        })
        .eq("payment_reference", reference)

      if (updateError) {
        console.error("Error updating booking:", updateError)
      }

      return NextResponse.json({
        status: true,
        message: "Payment verified successfully",
        data: verification.data,
      })
    } else {
      return NextResponse.json({
        status: false,
        message: "Payment verification failed",
        data: verification.data,
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
