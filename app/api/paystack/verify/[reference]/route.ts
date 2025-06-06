import { type NextRequest, NextResponse } from "next/server"

const PAYSTACK_SECRET_KEY = "sk_test_1a23b7e132f0e15ae350d96c112b051426f7eead"

export async function GET(request: NextRequest, { params }: { params: { reference: string } }) {
  try {
    const { reference } = params

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Paystack verification error:", error)
    return NextResponse.json({ status: false, message: "Payment verification failed" }, { status: 500 })
  }
}
