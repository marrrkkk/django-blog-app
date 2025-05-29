import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/register/", {
        username,
        password,
      });
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20 p-4">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Register</h2>
        <Input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleRegister}>Register</Button>
      </CardContent>
    </Card>
  );
}
