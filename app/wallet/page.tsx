"use client"

import { useState, useEffect } from "react"
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Gift, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase, type User, type WalletTransaction } from "@/lib/supabase"
import { initializePayment, generateReference } from "@/lib/paystack"

export default function WalletPage() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [fundAmount, setFundAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [funding, setFunding] = useState(false)

  useEffect(() => {
    fetchUserData()
    fetchTransactions()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (error) throw error
        setUser(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        const { data, error } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(20)

        if (error) throw error
        setTransactions(data || [])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const handleFundWallet = async () => {
    if (!user || !fundAmount || Number.parseFloat(fundAmount) < 100) {
      alert("Minimum funding amount is ₦100")
      return
    }

    setFunding(true)
    try {
      const amount = Number.parseFloat(fundAmount)
      const reference = generateReference()

      // Create pending transaction
      await supabase.from("wallet_transactions").insert({
        user_id: user.id,
        type: "credit",
        amount,
        description: "Wallet funding",
        reference,
        status: "pending",
      })

      // Initialize payment
      const paymentResponse = await initializePayment(user.email, amount, reference, {
        type: "wallet_funding",
        user_id: user.id,
      })

      if (paymentResponse.status) {
        window.location.href = paymentResponse.data.authorization_url
      } else {
        throw new Error("Payment initialization failed")
      }
    } catch (error) {
      console.error("Error funding wallet:", error)
      alert("Error funding wallet. Please try again.")
    } finally {
      setFunding(false)
    }
  }

  const generateReferralLink = () => {
    if (!user) return ""
    return `${window.location.origin}/auth/register?ref=${user.referral_code}`
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(generateReferralLink())
    alert("Referral link copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl font-bold text-amber-600">
              QADA.ng
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your wallet balance, transactions, and rewards</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">₦{user?.wallet_balance?.toLocaleString() || "0"}</div>
              <p className="text-xs text-muted-foreground">Available for bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{user?.reward_points || 0}</div>
              <p className="text-xs text-muted-foreground">Earn 1 point per ₦100 spent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{user?.referral_code}</div>
              <Button variant="outline" size="sm" className="mt-2" onClick={copyReferralLink}>
                Copy Referral Link
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <h3 className="font-semibold">Fund Wallet</h3>
                    <p className="text-sm text-gray-600">Add money to your wallet</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fund Your Wallet</DialogTitle>
                <DialogDescription>Add money to your wallet for faster bookings and payments</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  {funding ? "Processing..." : "Fund Wallet"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/rewards">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Gift className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold">Redeem Rewards</h3>
                  <p className="text-sm text-gray-600">Convert points to wallet credit</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="rewards">Rewards History</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your wallet transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.type === "credit" ? (
                              <ArrowDownLeft className="h-4 w-4 text-green-600 mr-1" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-red-600 mr-1" />
                            )}
                            {transaction.type === "credit" ? "Credit" : "Debit"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                            {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Referral Program</CardTitle>
                <CardDescription>Earn ₦500 for each friend you refer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-medium text-amber-800 mb-2">Your Referral Code</h3>
                    <div className="flex items-center space-x-2">
                      <code className="bg-white px-3 py-2 rounded border text-lg font-mono">{user?.referral_code}</code>
                      <Button variant="outline" size="sm" onClick={copyReferralLink}>
                        Copy Link
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">0</div>
                      <p className="text-sm text-gray-600">Friends Referred</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">₦0</div>
                      <p className="text-sm text-gray-600">Referral Earnings</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">₦500</div>
                      <p className="text-sm text-gray-600">Per Referral</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Share your referral code with friends</li>
                      <li>• They sign up and make their first booking</li>
                      <li>• You both get ₦500 wallet credit</li>
                      <li>• No limit on referrals!</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Rewards Program</CardTitle>
                <CardDescription>Earn points with every booking and redeem for wallet credit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-green-800">Current Points</h3>
                        <p className="text-2xl font-bold text-green-600">{user?.reward_points || 0} points</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-700">Wallet Value</p>
                        <p className="text-lg font-semibold text-green-600">
                          ₦{((user?.reward_points || 0) * 1).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Earn Points</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 1 point per ₦100 spent</li>
                        <li>• 50 bonus points for reviews</li>
                        <li>• 100 points for referrals</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Redeem Points</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 1 point = ₦1 wallet credit</li>
                        <li>• Minimum: 100 points</li>
                        <li>• Instant conversion</li>
                      </ul>
                    </div>
                  </div>

                  {(user?.reward_points || 0) >= 100 && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Redeem {user?.reward_points} Points (₦{user?.reward_points})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
