"use client"

import { useState, useEffect } from "react"
import API from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

type LikeButtonProps = {
  blogId: number
  initialLiked: boolean
  initialCount: number
}

export default function LikeButton({ blogId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const token = localStorage.getItem("token")

  // Sync with props when they change (e.g., on page refresh)
  useEffect(() => {
    setLiked(initialLiked)
    setCount(initialCount)
  }, [initialLiked, initialCount])

  const toggleLike = async () => {
    if (isLoading) return

    setIsLoading(true)

    // Optimistic update
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : count - 1
    setLiked(newLiked)
    setCount(newCount)

    try {
      const res = await API.post(`/blogs/${blogId}/like/`, {}, { headers: { Authorization: `Token ${token}` } })

      // Update with server response
      setLiked(res.data.liked)
      setCount(res.data.like_count)
    } catch (err) {
      console.error(err)
      // Revert optimistic update on error
      setLiked(!newLiked)
      setCount(newLiked ? count - 1 : count + 1)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={toggleLike}
      disabled={isLoading}
      variant={liked ? "default" : "outline"}
      size="sm"
      className={`transition-all duration-200 ${
        liked
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/25"
          : "hover:border-red-500 hover:text-red-500"
      }`}
    >
      <Heart
        className={`w-4 h-4 mr-2 transition-all duration-200 ${
          liked ? "fill-white text-white scale-110" : "fill-none"
        }`}
      />
      <span className="font-medium">{count}</span>
      {isLoading && (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin ml-2" />
      )}
    </Button>
  )
}
