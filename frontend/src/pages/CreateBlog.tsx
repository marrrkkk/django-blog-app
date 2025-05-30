"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Editor from "../components/Editor"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import API from "@/lib/api"
import { PenTool, ArrowLeft, Send, Save } from "lucide-react"

export default function CreateBlog() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and content")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await API.post(
        "/blogs/",
        { title, description },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } },
      )

      // Navigate to the created blog
      if (response.data?.id) {
        navigate(`/blogs/${response.data.id}`)
      } else {
        navigate("/")
      }

      alert("Blog created successfully!")
    } catch (err: any) {
      if (err.response) {
        console.error("Server error:", err.response.data)
        alert(`Error: ${JSON.stringify(err.response.data)}`)
      } else {
        console.error(err)
        alert("An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    // Save to localStorage as draft
    localStorage.setItem("blogDraft", JSON.stringify({ title, description }))
    alert("Draft saved locally!")
  }

  // Load draft on component mount
  useState(() => {
    const draft = localStorage.getItem("blogDraft")
    if (draft) {
      try {
        const { title: draftTitle, description: draftDescription } = JSON.parse(draft)
        if (draftTitle || draftDescription) {
          const loadDraft = confirm("Found a saved draft. Would you like to load it?")
          if (loadDraft) {
            setTitle(draftTitle || "")
            setDescription(draftDescription || "")
          }
        }
      } catch (e) {
        console.error("Error loading draft:", e)
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <PenTool className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Blog</h1>
              <p className="text-muted-foreground">Share your thoughts with the world</p>
            </div>
          </div>
        </div>

        {/* Blog Form */}
        <div className="space-y-6">
          {/* Title Input */}
          <Card className="border-0 shadow-xl shadow-black/5 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold text-foreground">Blog Title</h2>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter an engaging title for your blog..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg h-12 border-border/50 focus:border-primary transition-colors"
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="border-0 shadow-xl shadow-black/5 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold text-foreground">Content</h2>
              <p className="text-sm text-muted-foreground">
                Use the editor below to write your blog content. You can format text, add headings, lists, and more.
              </p>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px]">
                <Editor content={description} setContent={setDescription} />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-0 shadow-xl shadow-black/5 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (title || description) {
                        const confirmDiscard = confirm("Are you sure you want to discard your changes?")
                        if (confirmDiscard) {
                          setTitle("")
                          setDescription("")
                          localStorage.removeItem("blogDraft")
                          navigate("/")
                        }
                      } else {
                        navigate("/")
                      }
                    }}
                    className="hover:bg-muted/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Publishing...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publish Blog
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
