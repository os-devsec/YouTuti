import { useState } from "react"
import type { FormEvent } from "react"

interface Props {
  onSubmit: (content: string) => Promise<void>
}

export default function CommentForm({
  onSubmit
}: Props) {

  const [content, setContent] = useState("")

  const handleSubmit = async (
    e: FormEvent
  ) => {

    e.preventDefault()

    if (!content.trim()) return

    await onSubmit(content)

    setContent("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe un comentario..."
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-xl
          p-4
          min-h-30
          outline-none
          focus:border-blue-500
        "
      />

      <button
        className="
          bg-zinc-50
          text-zinc-950
          hover:bg-zinc-200
          rounded-full
          px-6
          py-3
          text-sm
          font-semibold
          self-end
        "
      >
        Comentar
      </button>

    </form>
  )
}
