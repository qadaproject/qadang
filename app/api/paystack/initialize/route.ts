import { type NextRequest, NextResponse } from "next/server"
import { initializePayment, generateReference } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, metadata } = body

    if (!email || !amount) {
      return NextResponse.json({ error: "Email and amount are required" }, { status: 400 })
    }

    const reference = generateReference()

    const paymentData = await initializePayment({
      email,
      amount,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/callback`,
      metadata: {
        ...metadata,
        custom_fields: [
          {
            display_name: "Car Rental",
            variable_name: "car_rental",
            value: "QADA.ng Car Rental Service",
          },
        ],
      },
    })

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
