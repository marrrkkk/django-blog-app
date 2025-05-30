"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Editor from "@/components/Editor" // Your TipTap editor component
import API from "@/lib/api"
import { Edit3, ArrowLeft, Save, X } from "lucide-react"

export default function EditBlog() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [originalTitle, setOriginalTitle] = useState("")
  const [originalContent, setOriginalContent] = useState("")

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        })
        setTitle(res.data.title)
        setContent(res.data.description)
        setOriginalTitle(res.data.title)
        setOriginalContent(res.data.description)
        setLoading(false)
      } catch (err) {
        console.error(err)
        navigate("/")
      }
    }
    fetchBlog()
  }, [id, token, navigate])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content")
      return
    }

    setIsSaving(true)
    try {
      await API.put(`/blogs/${id}/`, { title, description: content }, { headers: { Authorization: `Token ${token}` } })
      navigate(`/blogs/${id}`)
    } catch (err) {
      console.error(err)
      alert("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    const hasChanges = title !== originalTitle || content !== originalContent
    if (hasChanges) {
      const confirmDiscard = confirm("Are you sure you want to discard your changes?")
      if (confirmDiscard) {
        navigate(`/blogs/${id}`)
      }
    } else {
      navigate(`/blogs/${id}`)
    }
  }

  const handleSaveDraft = () => {
    // Save to localStorage as draft
    localStorage.setItem(`editDraft_${id}`, JSON.stringify({ title, content }))
    alert("Draft saved locally!")
  }

  // Load draft on component mount
  useEffect(() => {
    if (!loading) {
      const draft = localStorage.getItem(`editDraft_${id}`)
      if (draft) {
        try {
          const { title: draftTitle, content: draftContent } = JSON.parse(draft)
          if (draftTitle !== originalTitle || draftContent !== originalContent) {
            const loadDraft = confirm("Found a saved draft with changes. Would you like to load it?")
            if (loadDraft) {
              setTitle(draftTitle || originalTitle)
              setContent(draftContent || originalContent)
            }
          }
        } catch (e) {
          console.error("Error loading draft:", e)
        }
      }
    }
  }, [loading, id, originalTitle, originalContent])

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
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Edit3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Blog</h1>
              <p className="text-muted-foreground">Make changes to your blog post</p>
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
              <p className="text-sm text-muted-foreground">Edit your blog content using the rich text editor below.</p>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px]">
                <Editor content={content} setContent={setContent} />
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
                  <Button variant="ghost" onClick={handleCancel} className="hover:bg-muted/50">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !title.trim() || !content.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes Indicator */}
          {(title !== originalTitle || content !== originalContent) && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">You have unsaved changes</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
