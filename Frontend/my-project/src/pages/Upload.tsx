import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCategories } from "../services/category.service"
import { uploadVideo } from "../services/video.service"

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const responseError = error as {
      response?: {
        data?: {
          detail?: string
        }
      }
    }

    return responseError.response?.data?.detail ?? fallback
  }

  return fallback
}

export default function Upload() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState(0)
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
        if (data.length > 0) {
          setCategoryId(data[0].id)
        }
      } catch {
        setError("No se pudieron cargar las categorías.")
      }
    }

    loadCategories()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim() || !description.trim() || !videoUrl.trim() || categoryId === 0) {
      setError("Completa titulo, descripcion, categoria y URL del video.")
      return
    }

    setLoading(true)

    try {
      await uploadVideo({
        title,
        description,
        categoryId,
        videoUrl,
        thumbnailUrl: thumbnailUrl.trim() || undefined
      })
      setSuccess("Video publicado correctamente.")
      setTitle("")
      setDescription("")
      setVideoUrl("")
      setThumbnailUrl("")
      if (categories.length > 0) {
        setCategoryId(categories[0].id)
      }
      setTimeout(() => {
        navigate("/")
      }, 1200)
    } catch (error) {
      setError(getErrorMessage(error, "Error al publicar el video."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-50">Subir video</h1>

      <form className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-5" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Titulo"
          className="rounded-md border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descripcion"
          className="h-36 rounded-md border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
        />

        <select
          value={categoryId}
          onChange={(event) => setCategoryId(Number(event.target.value))}
          className="rounded-md border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="url"
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
          placeholder="URL del video en S3"
          className="rounded-md border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
        />

        <input
          type="url"
          value={thumbnailUrl}
          onChange={(event) => setThumbnailUrl(event.target.value)}
          placeholder="URL de miniatura en S3 (opcional)"
          className="rounded-md border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-zinc-50 p-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  )
}
