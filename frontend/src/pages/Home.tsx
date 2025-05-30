import { useEffect, useState } from "react"
import API from "@/lib/api"
import BlogCard from "@/components/BlogCard"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Plus, BookOpen } from "lucide-react"

type Blog = {
  id: number
  title: string
  description: string
  author: string
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await API.get("/blogs/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      setBlogs(res.data) // recent first
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Home</h1>
              <p className="text-muted-foreground">Welcome back to your blog feed</p>
            </div>
          </div>
        </div>

        {/* Blog Feed Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Blog Feed</h2>
            <p className="text-muted-foreground mt-1">
              {blogs.length} {blogs.length === 1 ? "post" : "posts"} available
            </p>
          </div>

          <Link to="/blogs/create">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Create Blog
            </Button>
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="space-y-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => <BlogCard key={blog.id} {...blog} />)
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No blogs yet</h3>
              <p className="text-muted-foreground mb-6">Get started by creating your first blog post</p>
              <Link to="/blogs/create">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Blog
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
