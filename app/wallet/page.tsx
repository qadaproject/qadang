"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard, History, Wallet } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { LoadingAnimation } from "@/components/ui/loading-animation"

interface WalletTransaction {
  id: string
  type: string
  amount: number
  description: string
  status: string
  created_at: string
  reference?: string
}

export default function WalletPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const [fundAmount, setFundAmount] = useState("")
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [funding, setFunding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }

    if (user) {
      fetchTransactions()
    }
  }, [user, loading, router])

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setTransactions(data || [])
    } catch (err) {
      console.error("Error fetching transactions:", err)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const generateReference = () => {
    return `qada_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleFundWallet = async () => {
    if (!user || !profile) {
      setError("Please log in to fund your wallet")
      return
    }

    const amount = Number.parseFloat(fundAmount)
    if (!amount || amount < 100) {
      setError("Minimum funding amount is ₦100")
      return
    }

    setFunding(true)
    setError(null)

    try {
      const reference = generateReference()

      // Create pending transaction
      const { error: transactionError } = await supabase.from("wallet_transactions").insert({
        user_id: user.id,
        type: "credit",
        amount,
        description: "Wallet funding",
        reference,
        status: "pending",
      })

      if (transactionError) throw transactionError

      // Initialize Paystack payment
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
          amount: amount * 100, // Convert to kobo
          reference,
          callback_url: `${window.location.origin}/payment/callback`,
          metadata: {
            type: "wallet_funding",
            user_id: user.id,
          },
        }),
      })

      const paymentData = await response.json()

      if (paymentData.status) {
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url
      } else {
        throw new Error("Payment initialization failed")
      }
    } catch (err) {
      console.error("Error funding wallet:", err)
      setError("Failed to initialize payment. Please try again.")
    } finally {
      setFunding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingAnimation text="Loading wallet..." />
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Wallet</h1>
              <p className="text-gray-600">Manage your wallet balance and transactions</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ₦{(profile.wallet_balance || 0).toLocaleString()}
                  </div>
                  <p className="text-gray-600">Available balance</p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Money
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Fund Your Wallet</DialogTitle>
                          <DialogDescription>
                            Add money to your wallet for faster bookings and payments
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {error && (
                            <Alert variant="destructive">
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}
                          <div>
                            <Label htmlFor="amount">Amount (₦)</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="Enter amount"
                              value={fundAmount}
                              onChange={(e) => setFundAmount(e.target.value)}
                              min="100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum amount: ₦100</p>
                          </div>
                          <Button
                            onClick={handleFundWallet}
                            disabled={funding || !fundAmount || Number.parseFloat(fundAmount) < 100}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            {funding ? "Processing..." : "Fund Wallet"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Link href="/wallet/history">
                      <Button variant="outline">
                        <History className="h-4 w-4 mr-2" />
                        View History
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTransactions ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading transactions...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {transaction.type === "credit" ? (
                              <ArrowDownLeft className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                          </p>
                          <Badge
                            className={
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Money
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Fund Your Wallet</DialogTitle>
                      <DialogDescription>Add money to your wallet for faster bookings and payments</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div>
                        <Label htmlFor="quick-amount">Amount (₦)</Label>
                        <Input
                          id="quick-amount"
                          type="number"
                          placeholder="Enter amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          min="100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum amount: ₦100</p>
                      </div>
                      <Button
                        onClick={handleFundWallet}
                        disabled={funding || !fundAmount || Number.parseFloat(fundAmount) < 100}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {funding ? "Processing..." : "Fund Wallet"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Link href="/wallet/history">
                  <Button variant="outline" className="w-full justify-start">
                    <History className="h-4 w-4 mr-2" />
                    Transaction History
                  </Button>
                </Link>

                <Link href="/bookings">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Use for Booking
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Wallet Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Funded:</span>
                  <span className="font-medium">₦{(profile.wallet_balance || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-medium">₦0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-green-600">₦{(profile.wallet_balance || 0).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
