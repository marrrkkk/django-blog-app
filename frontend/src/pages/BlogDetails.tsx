import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "@/lib/api"
import CommentSection from "../components/CommentSection"
import LikeButton from "../components/LikeButton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreVertical,
  User,
  Calendar,
  ArrowLeft,
  Edit3,
  Trash2,
} from "lucide-react"

export default function BlogDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState<any>(null)

  const currentUser = localStorage.getItem("username")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        })
        setBlog(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBlog()
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Delete this blog?")) return
    try {
      await API.delete(`/blogs/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      navigate("/") // or to /blogs
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = () => {
    navigate(`/blogs/${id}/edit`)
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Blog Header */}
        <Card className="border-0 shadow-xl shadow-black/5 bg-card/80 backdrop-blur-sm mb-8">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                  {blog.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <Badge variant="secondary">{blog.author}</Badge>
                  </div>

                  {blog.created_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {blog.author === currentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Like Button */}
            <div className="pt-4 border-t border-border/50 mt-6">
              <LikeButton
                blogId={blog.id}
                initialLiked={blog.liked_by_user}
                initialCount={blog.like_count}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Blog Content with custom editor styles */}
        <Card className="border-0 shadow-xl shadow-black/5 bg-card/80 backdrop-blur-sm mb-8">
          <CardContent>
            <div
              className="ProseMirror"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentSection blogId={blog.id} blogAuthor={blog.author} />
      </div>
    </div>
  )
}
