import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import BlogCard from "@/components/BlogCard";
import { Link, useParams } from "react-router-dom";

interface Blog {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  blog: {
    id: number;
    title: string;
  };
  created_at: string;
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState({ username: "", password: "" });
  const [form, setForm] = useState({ username: "", password: "" });
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        const res = await API.get(`/accounts/profile/${username}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        const fetchedUsername = res.data.username;
        setUser({ username: fetchedUsername, password: "" });
        setForm({ username: fetchedUsername, password: "" });

        const blogsRes = await API.get(`/blogs/user/${fetchedUsername}/`);
        setBlogs(blogsRes.data);

        const commentsRes = await API.get(`/comments/user/${fetchedUsername}/`);
        setComments(commentsRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token, username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await API.put(
        "/accounts/profile/",
        { username: form.username, password: form.password },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      alert("Profile updated successfully!");
      setUser({ username: form.username, password: "" });
      setForm({ username: form.username, password: "" });
    } catch (error: any) {
      alert(
        error.response?.data?.username ||
          error.response?.data?.password ||
          "Update failed"
      );
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">My Profile</h2>
        <div>
          Username: <span className="font-medium">{user.username}</span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Edit Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
              />
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="New Password (optional)"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="blogs" className="pt-6">
        <TabsList>
          <TabsTrigger value="blogs">My Blogs</TabsTrigger>
          <TabsTrigger value="comments">My Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="blogs" className="pt-4 space-y-4">
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
            <p>No blogs found.</p>
          )}
        </TabsContent>

        <TabsContent value="comments" className="pt-4 space-y-4">
          {comments.length ? (
            comments.map((comment) => (
              <div key={comment.id} className="border p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  On blog:{" "}
                  <Link
                    to={`/blogs/${comment.blog.id}`}
                    className="underline text-blue-600"
                  >
                    {comment.blog.title}
                  </Link>
                </p>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
