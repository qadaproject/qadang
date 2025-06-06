const PAYSTACK_SECRET_KEY = "sk_test_1a23b7e132f0e15ae350d96c112b051426f7eead"
const PAYSTACK_PUBLIC_KEY = "pk_test_b8a2b8b8a2b8b8a2b8b8a2b8b8a2b8b8a2b8b8a2"

export const paystackConfig = {
  secretKey: PAYSTACK_SECRET_KEY,
  publicKey: PAYSTACK_PUBLIC_KEY,
  baseUrl: "https://api.paystack.co",
}

export interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: string | null
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: any
    log: any
    fees: number
    fees_split: any
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
      account_name: string | null
    }
    customer: {
      id: number
      first_name: string | null
      last_name: string | null
      email: string
      customer_code: string
      phone: string | null
      metadata: any
      risk_action: string
      international_format_phone: string | null
    }
    plan: any
    split: any
    order_id: any
    paidAt: string
    createdAt: string
    requested_amount: number
    pos_transaction_data: any
    source: any
    fees_breakdown: any
  }
}

export const initializePayment = async (data: {
  email: string
  amount: number
  reference: string
  callback_url?: string
  metadata?: any
}): Promise<PaystackInitializeResponse> => {
  const response = await fetch(`${paystackConfig.baseUrl}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackConfig.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      amount: data.amount * 100, // Convert to kobo
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const verifyPayment = async (reference: string): Promise<PaystackVerifyResponse> => {
  const response = await fetch(`${paystackConfig.baseUrl}/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${paystackConfig.secretKey}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const generateReference = (): string => {
  return `qada_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
