import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import API from "@/lib/api"
import { MessageSquare, User, MoreVertical, Reply, Trash2, Calendar, Send } from "lucide-react"

type Comment = {
  id: number
  content: string
  author: number
  author_username: string
  blog: number
  parent?: number
  created_at: string
  updated_at: string
  replies: Comment[]
}

type CommentSectionProps = {
  blogId: number
  blogAuthor: string
}

export default function CommentSection({ blogId, blogAuthor }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const token = localStorage.getItem("token")
  const currentUser = localStorage.getItem("username")

  const fetchComments = async () => {
    try {
      const res = await API.get(`/blogs/${blogId}/comments/`, {
        headers: { Authorization: `Token ${token}` },
      })
      setComments(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const postComment = async (content: string, parentId?: number) => {
    if (!content.trim()) return
    setIsPosting(true)
    try {
      await API.post(
        `/blogs/${blogId}/comments/`,
        {
          blog: blogId,
          content,
          ...(parentId ? { parent: parentId } : {}),
        },
        {
          headers: { Authorization: `Token ${token}` },
        },
      )
      fetchComments()
    } catch (err) {
      console.error(err)
    } finally {
      setIsPosting(false)
    }
  }

  const deleteComment = async (id: number) => {
    if (!confirm("Delete this comment?")) return
    try {
      await API.delete(`/comments/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      fetchComments()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [blogId])

  const rootComments = comments.filter((c) => !c.parent)

  return (
    <Card className="border-0 shadow-xl shadow-black/5 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Comments ({comments.length})</h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* New Comment Form */}
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none border-border/50 focus:border-primary transition-colors"
          />
          <div className="flex justify-end">
            <Button
              onClick={() => {
                postComment(newComment)
                setNewComment("")
              }}
              disabled={!newComment.trim() || isPosting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isPosting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isPosting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {rootComments.length > 0 ? (
            rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={postComment}
                onDelete={deleteComment}
                currentUser={currentUser}
                blogAuthor={blogAuthor}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

type CommentItemProps = {
  comment: Comment
  onReply: (content: string, parentId: number) => void
  onDelete: (id: number) => void
  currentUser: string | null
  blogAuthor: string
}

function CommentItem({ comment, onReply, onDelete, currentUser, blogAuthor }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const handleReply = async () => {
    if (!replyText.trim()) return
    setIsReplying(true)
    try {
      await onReply(replyText, comment.id)
      setReplyText("")
      setShowReplyForm(false)
      setShowReplies(true)
    } finally {
      setIsReplying(false)
    }
  }

  const isAuthor = comment.author_username === blogAuthor
  const canDelete = comment.author_username === currentUser || blogAuthor === currentUser

  return (
    <Card className="border-border/50 bg-muted/20">
      <CardContent className="p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isAuthor ? "default" : "secondary"} className="text-xs">
                {comment.author_username}
                {isAuthor && " (Author)"}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(comment.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onDelete(comment.id)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comment Content */}
        <p className="text-foreground mb-4 leading-relaxed">{comment.content}</p>

        {/* Comment Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-muted-foreground hover:text-primary"
          >
            <Reply className="w-4 h-4 mr-1" />
            Reply
          </Button>

          {comment.replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="text-muted-foreground hover:text-primary"
            >
              {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-primary/20">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[80px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleReply}
                disabled={!replyText.trim() || isReplying}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isReplying ? (
                  <div className="w-3 h-3 border border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-1" />
                ) : (
                  <Send className="w-3 h-3 mr-1" />
                )}
                {isReplying ? "Posting..." : "Reply"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReplyForm(false)
                  setReplyText("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {showReplies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-primary/20">
            {comment.replies.map((reply) => (
              <Card key={reply.id} className="border-border/30 bg-background/50">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {reply.author_username}
                        {reply.author_username === blogAuthor && " (Author)"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {(reply.author_username === currentUser || blogAuthor === currentUser) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(reply.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{reply.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
