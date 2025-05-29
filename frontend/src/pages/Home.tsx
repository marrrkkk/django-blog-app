import { useEffect, useState } from "react";
import API from "@/lib/api";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Blog = {
  id: number;
  title: string;
  description: string;
  author: string;
};

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/blogs/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setBlogs(res.data); // recent first
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Home</h1>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Blog Feed</h1>
      </div>

      <Link to="/blogs/create">
        <Button>Create Blog</Button>
      </Link>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </div>
  );
}
