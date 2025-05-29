// src/pages/EditBlog.tsx
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Editor from "@/components/Editor" // Your TipTap editor component
import API from "@/lib/api"

export default function EditBlog() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        })
        setTitle(res.data.title)
        setContent(res.data.description)
        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBlog()
  }, [id, token])

  const handleSave = async () => {
    try {
      await API.put(
        `/blogs/${id}/`,
        { title, description: content },
        { headers: { Authorization: `Token ${token}` } }
      )
      navigate(`/blogs/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p className="text-center">Loading blog...</p>

  return (
    <div className="max-w-3xl mx-auto space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold">Edit Blog</h1>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog title"
      />
      <Editor content={content} setContent={setContent} />
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  )
}
