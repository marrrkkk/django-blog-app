"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, LogOut, Home, PenTool, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const token = localStorage.getItem("token")
  const username = localStorage.getItem("username")
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    // Clear any drafts
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("blogDraft") || key.startsWith("editDraft_")) {
        localStorage.removeItem(key)
      }
    })
    navigate("/login")
  }

  const isActivePath = (path: string) => {
    return location.pathname === path
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">MyBlogApp</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {token && username ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isActivePath("/") ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                  <Button
                    variant={isActivePath("/blogs/create") ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => navigate("/blogs/create")}
                    className="flex items-center gap-2"
                  >
                    <PenTool className="w-4 h-4" />
                    Write
                  </Button>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted/50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getUserInitials(username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-medium">{username}</span>
                        <Badge variant="secondary" className="text-xs">
                          Author
                        </Badge>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => navigate(`/profile/${username}`)}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => navigate("/login")} size="sm">
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-3">
            {token && username ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{username}</div>
                    <Badge variant="secondary" className="text-xs">
                      Author
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    variant={isActivePath("/") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      navigate("/")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                  <Button
                    variant={isActivePath("/blogs/create") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      navigate("/blogs/create")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <PenTool className="w-4 h-4" />
                    Write
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      navigate(`/profile/${username}`)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/login")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    navigate("/register")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
