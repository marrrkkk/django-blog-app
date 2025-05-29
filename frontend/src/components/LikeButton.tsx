import { useState } from "react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

type LikeButtonProps = {
  blogId: number;
  initialLiked: boolean;
  initialCount: number;
};

export default function LikeButton({ blogId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const token = localStorage.getItem("token");

  const toggleLike = async () => {
    try {
      const res = await API.post(
        `/blogs/${blogId}/like/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      setLiked(res.data.liked);
      setCount(res.data.like_count);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button onClick={toggleLike} variant={liked ? "secondary" : "outline"}>
      <Heart className="w-4 h-4 mr-2" fill={liked ? "red" : "none"} />
      {count}
    </Button>
  );
}
