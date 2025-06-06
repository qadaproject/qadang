"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ArrowLeft, Gift, Star, Trophy, Zap, Crown, Target, Car } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingAnimation } from "@/components/ui/loading-animation"
import { supabase } from "@/lib/supabase"

interface RewardTier {
  name: string
  minPoints: number
  maxPoints: number
  benefits: string[]
  icon: React.ReactNode
  color: string
}

interface RedeemableReward {
  id: string
  name: string
  description: string
  points_required: number
  value: number
  category: string
  available: boolean
}

export default function RewardsPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const rewardTiers: RewardTier[] = [
    {
      name: "Bronze",
      minPoints: 0,
      maxPoints: 999,
      benefits: ["1 point per ₦100 spent", "Basic customer support"],
      icon: <Target className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      name: "Silver",
      minPoints: 1000,
      maxPoints: 4999,
      benefits: ["1.2 points per ₦100 spent", "Priority customer support", "5% booking discount"],
      icon: <Star className="h-6 w-6" />,
      color: "text-gray-600",
    },
    {
      name: "Gold",
      minPoints: 5000,
      maxPoints: 14999,
      benefits: ["1.5 points per ₦100 spent", "Premium support", "10% booking discount", "Free driver upgrade"],
      icon: <Trophy className="h-6 w-6" />,
      color: "text-yellow-600",
    },
    {
      name: "Platinum",
      minPoints: 15000,
      maxPoints: Number.POSITIVE_INFINITY,
      benefits: [
        "2 points per ₦100 spent",
        "VIP support",
        "15% booking discount",
        "Free premium cars",
        "Airport pickup",
      ],
      icon: <Crown className="h-6 w-6" />,
      color: "text-purple-600",
    },
  ]

  const redeemableRewards: RedeemableReward[] = [
    {
      id: "wallet_100",
      name: "₦100 Wallet Credit",
      description: "Add ₦100 to your wallet balance",
      points_required: 100,
      value: 100,
      category: "wallet",
      available: true,
    },
    {
      id: "wallet_500",
      name: "₦500 Wallet Credit",
      description: "Add ₦500 to your wallet balance",
      points_required: 500,
      value: 500,
      category: "wallet",
      available: true,
    },
    {
      id: "wallet_1000",
      name: "₦1,000 Wallet Credit",
      description: "Add ₦1,000 to your wallet balance",
      points_required: 1000,
      value: 1000,
      category: "wallet",
      available: true,
    },
    {
      id: "discount_5",
      name: "5% Booking Discount",
      description: "Get 5% off your next booking",
      points_required: 200,
      value: 0,
      category: "discount",
      available: true,
    },
    {
      id: "discount_10",
      name: "10% Booking Discount",
      description: "Get 10% off your next booking",
      points_required: 400,
      value: 0,
      category: "discount",
      available: true,
    },
    {
      id: "free_driver",
      name: "Free Driver Upgrade",
      description: "Get a free driver for your next booking",
      points_required: 800,
      value: 0,
      category: "upgrade",
      available: true,
    },
  ]

  const getCurrentTier = () => {
    const points = profile?.reward_points || 0
    return rewardTiers.find((tier) => points >= tier.minPoints && points <= tier.maxPoints) || rewardTiers[0]
  }

  const getNextTier = () => {
    const currentTier = getCurrentTier()
    const currentIndex = rewardTiers.findIndex((tier) => tier.name === currentTier.name)
    return currentIndex < rewardTiers.length - 1 ? rewardTiers[currentIndex + 1] : null
  }

  const getProgressToNextTier = () => {
    const currentTier = getCurrentTier()
    const nextTier = getNextTier()
    const points = profile?.reward_points || 0

    if (!nextTier) return 100

    const progress = ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    return Math.min(progress, 100)
  }

  const handleRedeem = async (reward: RedeemableReward) => {
    if (!user || !profile) return

    if ((profile.reward_points || 0) < reward.points_required) {
      setError("Insufficient points to redeem this reward")
      return
    }

    setRedeeming(reward.id)
    setError(null)
    setSuccess(null)

    try {
      // Deduct points
      const newPoints = (profile.reward_points || 0) - reward.points_required

      const { error: updateError } = await supabase.from("users").update({ reward_points: newPoints }).eq("id", user.id)

      if (updateError) throw updateError

      // Add wallet credit if applicable
      if (reward.category === "wallet") {
        const newBalance = (profile.wallet_balance || 0) + reward.value

        const { error: balanceError } = await supabase
          .from("users")
          .update({ wallet_balance: newBalance })
          .eq("id", user.id)

        if (balanceError) throw balanceError

        // Record transaction
        await supabase.from("wallet_transactions").insert({
          user_id: user.id,
          type: "credit",
          amount: reward.value,
          description: `Reward redemption: ${reward.name}`,
          status: "completed",
        })
      }

      // Record reward redemption
      await supabase.from("reward_redemptions").insert({
        user_id: user.id,
        reward_name: reward.name,
        points_used: reward.points_required,
        value: reward.value,
      })

      setSuccess(`Successfully redeemed ${reward.name}!`)

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      console.error("Error redeeming reward:", err)
      setError("Failed to redeem reward. Please try again.")
    } finally {
      setRedeeming(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingAnimation text="Loading rewards..." />
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const progressToNext = getProgressToNextTier()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Rewards & Points</h1>
                <p className="text-gray-600">Redeem your points for amazing rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Points Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Your Points Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {(profile.reward_points || 0).toLocaleString()} Points
                </div>
                <p className="text-gray-600">Available for redemption</p>
              </div>

              {/* Current Tier */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={currentTier.color}>{currentTier.icon}</div>
                    <span className="font-semibold">{currentTier.name} Member</span>
                  </div>
                  <Badge variant="outline">{profile.reward_points || 0} points</Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {currentTier.benefits.map((benefit, index) => (
                    <div key={index}>• {benefit}</div>
                  ))}
                </div>
              </div>

              {/* Progress to Next Tier */}
              {nextTier && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to {nextTier.name}</span>
                    <span>{nextTier.minPoints - (profile.reward_points || 0)} points to go</span>
                  </div>
                  <Progress value={progressToNext} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Car className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Book a Car</p>
                  <p className="text-sm text-gray-600">1 point per ₦100 spent</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Star className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Write a Review</p>
                  <p className="text-sm text-gray-600">50 bonus points</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Gift className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Refer a Friend</p>
                  <p className="text-sm text-gray-600">100 bonus points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Redeemable Rewards */}
        <Card>
          <CardHeader>
            <CardTitle>Redeem Your Points</CardTitle>
            <CardDescription>Choose from our selection of rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {redeemableRewards.map((reward) => (
                <Card key={reward.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto">
                        {reward.category === "wallet" && <Zap className="h-6 w-6 text-blue-600" />}
                        {reward.category === "discount" && <Target className="h-6 w-6 text-green-600" />}
                        {reward.category === "upgrade" && <Crown className="h-6 w-6 text-purple-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{reward.name}</h3>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {reward.points_required.toLocaleString()} Points
                      </div>
                      <Button
                        onClick={() => handleRedeem(reward)}
                        disabled={
                          (profile.reward_points || 0) < reward.points_required ||
                          redeeming === reward.id ||
                          !reward.available
                        }
                        className="w-full"
                      >
                        {redeeming === reward.id
                          ? "Redeeming..."
                          : (profile.reward_points || 0) < reward.points_required
                            ? "Insufficient Points"
                            : "Redeem Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
