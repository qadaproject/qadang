export const generateReference = () => {
  return `qada_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const initializePayment = async (email: string, amount: number, reference: string, metadata: any = {}) => {
  try {
    const response = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        metadata,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error("Payment initialization error:", error)
    throw error
  }
}

export const verifyPayment = async (reference: string) => {
  try {
    const response = await fetch(`/api/paystack/verify/${reference}`)
    return await response.json()
  } catch (error) {
    console.error("Payment verification error:", error)
    throw error
  }
}
