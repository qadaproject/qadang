import { type NextRequest, NextResponse } from "next/server"

const PAYSTACK_SECRET_KEY = "sk_test_1a23b7e132f0e15ae350d96c112b051426f7eead"

export async function POST(request: NextRequest) {
  try {
    const { email, amount, reference, metadata } = await request.json()

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        reference,
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/callback`,
      }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Paystack initialization error:", error)
    return NextResponse.json({ status: false, message: "Payment initialization failed" }, { status: 500 })
  }
}
