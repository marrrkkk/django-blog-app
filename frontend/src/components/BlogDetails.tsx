import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import CommentSection from "./CommentSection";
import LikeButton from "./LikeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);

  const currentUser = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      navigate("/"); // or to /blogs
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    navigate(`/blogs/${id}/edit`);
  };

  if (!blog) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{blog.title}</h1>
          <p className="text-sm text-muted-foreground">By {blog.author}</p>
        </div>

        {blog.author === currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <LikeButton
        blogId={blog.id}
        initialLiked={blog.liked_by_user}
        initialCount={blog.like_count}
      />

      <p>{blog.description}</p>

      <CommentSection blogId={blog.id} blogAuthor={blog.author} />
    </div>
  );
}
