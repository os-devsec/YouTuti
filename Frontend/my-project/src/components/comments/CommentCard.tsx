import { useState } from "react"
import type { FormEvent } from "react"
import type { Comment } from "../../types/comment"

interface Props {
  comment: Comment
  username?: string
  currentUserId?: number
  onUpdate: (commentId: number, content: string) => Promise<void>
  onDelete: (commentId: number) => Promise<void>
}

export default function CommentCard({
  comment,
  username,
  currentUserId,
  onUpdate,
  onDelete
}: Props) {

  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(comment.content)
  const canManage = currentUserId === comment.user_id

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!content.trim()) return

    await onUpdate(comment.id, content)
    setEditing(false)
  }

  return (
    <article className="flex gap-3 border-b border-zinc-800 py-4">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-700 text-xs font-bold">
        {(username ?? "U").slice(0, 1).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-100">
          {username ?? `Usuario ${comment.user_id}`}
        </p>

        {editing ? (
          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-24 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-100 outline-none focus:border-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setContent(comment.content)
                  setEditing(false)
                }}
                className="rounded-full px-4 py-2 text-sm hover:bg-zinc-800"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
              >
                Guardar
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-1 whitespace-pre-line text-sm text-zinc-300">
            {comment.content}
          </p>
        )}

        {canManage && !editing && (
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setContent(comment.content)
                setEditing(true)
              }}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-100"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              className="text-xs font-semibold text-red-400 hover:text-red-300"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
