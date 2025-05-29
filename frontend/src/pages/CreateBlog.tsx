import { useState } from "react"
import Editor from "../components/Editor"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import API from "@/lib/api"

export default function CreateBlog() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    try {
      await API.post(
        "/blogs/",
        { title, description },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      )
      setTitle("")
      setDescription("")
      alert("Blog created successfully!")
    } catch (err: any) {
      if (err.response) {
        console.error("Server error:", err.response.data)
        alert(`Error: ${JSON.stringify(err.response.data)}`)
      } else {
        console.error(err)
        alert("An unexpected error occurred.")
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a new blog</h1>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-6"
      />

      <Editor content={description} setContent={setDescription} />

      <Button onClick={handleSubmit} className="mt-6">
        Submit
      </Button>
    </div>
  )
}