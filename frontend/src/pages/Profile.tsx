"use client"

import type React from "react"

import { useEffect, useState } from "react"
import API from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import BlogCard from "@/components/BlogCard"
import { Link, useParams } from "react-router-dom"
import { User, Edit3, MessageSquare, BookOpen, Calendar, ExternalLink } from "lucide-react"

interface Blog {
  id: number
  title: string
  description: string
  created_at: string
}

interface Comment {
  id: number
  content: string
  blog: {
    id: number
    title: string
  }
  created_at: string
}

export default function Profile() {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState({ username: "", password: "" })
  const [form, setForm] = useState({ username: "", password: "" })
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!username) return

    const fetchData = async () => {
      try {
        const res = await API.get(`/accounts/profile/${username}/`, {
          headers: { Authorization: `Token ${token}` },
        })

        const fetchedUsername = res.data.username
        setUser({ username: fetchedUsername, password: "" })
        setForm({ username: fetchedUsername, password: "" })

        const blogsRes = await API.get(`/blogs/user/${fetchedUsername}/`)
        setBlogs(blogsRes.data)

        const commentsRes = await API.get(`/comments/user/${fetchedUsername}/`)
        setComments(commentsRes.data)

        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [token, username])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    try {
      await API.put(
        "/accounts/profile/",
        { username: form.username, password: form.password },
        {
          headers: { Authorization: `Token ${token}` },
        },
      )
      alert("Profile updated successfully!")
      setUser({ username: form.username, password: "" })
      setForm({ username: form.username, password: "" })
    } catch (error: any) {
      alert(error.response?.data?.username || error.response?.data?.password || "Update failed")
    }
  }

  if (loading) {
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
        {/* Profile Header */}
        <Card className="border-0 shadow-xl shadow-black/5 bg-card/80 backdrop-blur-sm mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-sm">
                      @{user.username}
                    </Badge>
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      Edit Profile
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium text-foreground">
                        Username
                      </label>
                      <Input
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-foreground">
                        New Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="New Password (optional)"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{blogs.length}</div>
                <div className="text-sm text-muted-foreground">Blog Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{comments.length}</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="blogs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              My Blogs
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              My Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blogs" className="space-y-6">
            {blogs.length ? (
              blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  description={blog.description}
                  author={user.username}
                />
              ))
            ) : (
              <Card className="border-0 shadow-lg shadow-black/5 bg-card/80 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No blogs yet</h3>
                  <p className="text-muted-foreground mb-6">Start sharing your thoughts with the world</p>
                  <Link to="/blogs/create">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Create Your First Blog
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {comments.length ? (
              comments.map((comment) => (
                <Card key={comment.id} className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment on:</span>
                        <Link
                          to={`/blogs/${comment.blog.id}`}
                          className="text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1"
                        >
                          {comment.blog.title}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed">{comment.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-lg shadow-black/5 bg-card/80 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No comments yet</h3>
                  <p className="text-muted-foreground">Start engaging with the community by commenting on blogs</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
