import { useNavigate } from "react-router-dom";

type BlogCardProps = {
  id: number;
  title: string;
  description: string;
  author?: string; // optional, in case you don’t use it everywhere
};

export default function BlogCard({
  id,
  title,
  description,
  author,
}: BlogCardProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/blogs/${id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="border rounded-xl p-4 space-y-2 shadow-sm hover:bg-muted transition cursor-pointer"
    >
      <h2 className="font-semibold text-lg hover:underline">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
      {author && <p className="text-sm text-gray-500">By: {author}</p>}
    </div>
  );
}
