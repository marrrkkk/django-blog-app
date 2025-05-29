import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import API from "@/lib/api";

type Comment = {
  id: number;
  content: string;
  author: number;
  author_username: string;
  blog: number;
  parent?: number;
  created_at: string;
  updated_at: string;
  replies: Comment[];
};

type CommentSectionProps = {
  blogId: number;
  blogAuthor: string;
};

export default function CommentSection({ blogId, blogAuthor }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("username");

  const fetchComments = async () => {
    try {
      const res = await API.get(`/blogs/${blogId}/comments/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const postComment = async (content: string, parentId?: number) => {
    if (!content.trim()) return;
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
        }
      );
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (id: number) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await API.delete(`/comments/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const rootComments = comments.filter((c) => !c.parent);

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <Textarea
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button
        onClick={() => {
          postComment(newComment);
          setNewComment("");
        }}
      >
        Post
      </Button>

      {rootComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={postComment}
          onDelete={deleteComment}
          currentUser={currentUser}
          blogAuthor={blogAuthor}
        />
      ))}
    </div>
  );
}

type CommentItemProps = {
  comment: Comment;
  onReply: (content: string, parentId: number) => void;
  onDelete: (id: number) => void;
  currentUser: string | null;
  blogAuthor: string;
};

function CommentItem({
  comment,
  onReply,
  onDelete,
  currentUser,
  blogAuthor,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="border-l pl-4 mt-4 space-y-2">
      <div className="text-sm">
        <span className="font-medium">{comment.author_username}</span>: {comment.content}
      </div>

      <div className="flex gap-2 items-center">
        {(comment.author_username === currentUser || blogAuthor === currentUser) && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(comment.id)}>
            Delete
          </Button>
        )}
        {comment.replies.length > 0 && (
          <Button variant="link" size="sm" onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? "Hide Replies" : `View Replies (${comment.replies.length})`}
          </Button>
        )}
      </div>

      <div className="space-y-2 mt-2">
        <Input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Reply..."
        />
        <Button
          onClick={() => {
            if (replyText.trim()) {
              onReply(replyText, comment.id);
              setReplyText("");
              setShowReplies(true);
            }
          }}
        >
          Reply
        </Button>
      </div>

      {showReplies &&
        comment.replies.map((reply) => (
          <div
            key={reply.id}
            className="pl-4 border-l mt-2 text-sm flex items-center justify-between"
          >
            <div>
              <span className="font-medium">{reply.author_username}</span>: {reply.content}
            </div>
            {(reply.author_username === currentUser || blogAuthor === currentUser) && (
              <Button variant="destructive" onClick={() => onDelete(reply.id)}>
                Delete
              </Button>
            )}
          </div>
        ))}
    </div>
  );
}
