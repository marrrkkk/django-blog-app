import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link to="/">
        <h1 className="text-xl font-bold cursor-pointer">MyBlogApp</h1>
      </Link>

      <div className="space-x-4">
        {token && username ? (
          <>
            <Button
              variant="ghost"
              onClick={() => navigate(`/profile/${username}`)}
            >
              {username}'s Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        )}
      </div>
    </nav>
  );
}
