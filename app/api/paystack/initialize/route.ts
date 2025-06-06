import { type NextRequest, NextResponse } from "next/server"

const PAYSTACK_SECRET_KEY = "sk_test_1a23b7e132f0e15ae350d96c112b051426f7eead"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, reference, callback_url, metadata } = body

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
        callback_url,
        metadata,
      }),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Paystack initialization error:", error)
    return NextResponse.json({ status: false, message: "Payment initialization failed" }, { status: 500 })
  }
}
