import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, ArrowRight } from "lucide-react"

type BlogCardProps = {
  id: number
  title: string
  description: string
  author?: string // optional, in case you don't use it everywhere
}

export default function BlogCard({ id, title, description, author }: BlogCardProps) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/blogs/${id}`)
  }

  return (
    <Card
      onClick={handleNavigate}
      className="group cursor-pointer border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 bg-card/80 backdrop-blur-sm"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h2 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {title}
          </h2>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-4" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-4">{description}</p>

        {author && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-muted-foreground" />
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {author}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
