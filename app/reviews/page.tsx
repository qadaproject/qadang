"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, MessageCircle, Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { supabase, type Review, type Booking } from "@/lib/supabase"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
    fetchPendingBookings()
  }, [])

  const fetchReviews = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from("reviews")
          .select(`
            *,
            cars (name, brand, model, images),
            drivers (first_name, last_name),
            bookings (pickup_date, return_date)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setReviews(data || [])
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const fetchPendingBookings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            cars (name, brand, model, images),
            drivers (first_name, last_name)
          `)
          .eq("user_id", user.id)
          .eq("status", "completed")
          .not("id", "in", `(${reviews.map((r) => r.booking_id).join(",") || "null"})`)

        if (error) throw error
        setPendingBookings(data || [])
      }
    } catch (error) {
      console.error("Error fetching pending bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async () => {
    if (!selectedBooking) return

    setSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("reviews").insert({
        booking_id: selectedBooking.id,
        user_id: user.id,
        car_id: selectedBooking.car_id,
        driver_id: selectedBooking.driver_id,
        rating,
        comment,
      })

      if (error) throw error

      // Award reward points for review
      await supabase.from("reward_transactions").insert({
        user_id: user.id,
        type: "earned",
        points: 50,
        description: "Review submitted",
        booking_id: selectedBooking.id,
      })

      // Update user's reward points
      const { data: userData } = await supabase.from("users").select("reward_points").eq("id", user.id).single()

      await supabase
        .from("users")
        .update({ reward_points: (userData?.reward_points || 0) + 50 })
        .eq("id", user.id)

      alert("Review submitted successfully! You earned 50 reward points.")
      setSelectedBooking(null)
      setRating(5)
      setComment("")
      fetchReviews()
      fetchPendingBookings()
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Error submitting review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
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
          <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
          <p className="text-gray-600">Share your experience and help other travelers</p>
        </div>

        {/* Pending Reviews */}
        {pendingBookings.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Pending Reviews ({pendingBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingBookings.map((booking) => (
                  <Card key={booking.id} className="border border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        <Image
                          src={booking.cars?.images?.[0] || "/placeholder.svg"}
                          alt={booking.cars?.name || "Car"}
                          width={80}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {booking.cars?.brand} {booking.cars?.model}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.pickup_date).toLocaleDateString()} -{" "}
                            {new Date(booking.return_date).toLocaleDateString()}
                          </p>
                          {booking.with_driver && booking.drivers && (
                            <p className="text-sm text-gray-600">
                              Driver: {booking.drivers.first_name} {booking.drivers.last_name}
                            </p>
                          )}
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              Write Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Write a Review</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Overall Rating</Label>
                                {renderStars(rating, true, setRating)}
                              </div>
                              <div>
                                <Label htmlFor="comment">Your Review</Label>
                                <Textarea
                                  id="comment"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  placeholder="Share your experience..."
                                  className="min-h-[100px]"
                                />
                              </div>
                              <Button
                                onClick={submitReview}
                                disabled={submitting}
                                className="w-full bg-amber-500 hover:bg-amber-600"
                              >
                                {submitting ? "Submitting..." : "Submit Review"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search reviews..." className="pl-10" />
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-gray-600">Complete a booking to write your first review</p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Image
                      src={review.cars?.images?.[0] || "/placeholder.svg"}
                      alt={review.cars?.name || "Car"}
                      width={120}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {review.cars?.brand} {review.cars?.model}
                          </h3>
                          <p className="text-gray-600">
                            Reviewed on {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-sm text-gray-500 mt-1">{review.rating}/5 stars</p>
                        </div>
                      </div>

                      {review.with_driver && review.drivers && (
                        <div className="mb-3">
                          <Badge variant="secondary" className="text-xs">
                            With Driver: {review.drivers.first_name} {review.drivers.last_name}
                          </Badge>
                        </div>
                      )}

                      <p className="text-gray-700 mb-4">{review.comment}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Booking: {review.bookings?.pickup_date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
