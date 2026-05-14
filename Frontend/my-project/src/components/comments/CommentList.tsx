import CommentCard from "./CommentCard"
import type { Comment } from "../../types/comment"

interface Props {
  comments: Comment[]
  commentAuthors?: Record<number, string>
  currentUserId?: number
  onUpdate: (commentId: number, content: string) => Promise<void>
  onDelete: (commentId: number) => Promise<void>
}

export default function CommentList({
  comments,
  commentAuthors = {},
  currentUserId,
  onUpdate,
  onDelete
}: Props) {
  return (
    <section className="mt-8">

      <h2 className="mb-4 text-xl font-semibold">
        {comments.length} comentarios
      </h2>

      <div>
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            username={commentAuthors[comment.user_id]}
            currentUserId={currentUserId}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  )
}
