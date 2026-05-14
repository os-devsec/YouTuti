import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import Layout from "../components/layout/Layout"
import VideoPlayer from "../components/video/VideoPlayer"
import CommentForm from "../components/comments/CommentForm"
import CommentList from "../components/comments/CommentList"
import RecommendedVideos from "../components/video/RecommendedVideos"
import UserAvatar from "../components/common/UserAvatar"

import {
  deleteVideo,
  getRecommendedVideos,
  getVideoById,
  updateVideo
} from "../services/video.service"

import {
  createComment,
  deleteComment,
  getCommentsByVideo,
  updateComment
} from "../services/comment.service"
import { getUserById } from "../services/auth.service"
import useAuth from "../hooks/useAuth"
import type { Comment } from "../types/comment"
import type { User } from "../types/user"
import type { Video } from "../types/video"

const DEFAULT_THUMBNAIL_URL = "https://partial-practice-video-platform-videos.s3.us-east-1.amazonaws.com/Thumbnails/miniatura_generica.jpg"

export default function Watch() {

  const { id } = useParams()
  const navigate = useNavigate()
  const { user: authUser, isAuthenticated } = useAuth()

  const [video, setVideo] = useState<Video | null>(null)
  const [owner, setOwner] = useState<User | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentAuthors, setCommentAuthors] = useState<Record<number, string>>({})
  const [recommended, setRecommended] = useState<Video[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadCommentAuthors = async (items: Comment[]) => {
      const userIds = Array.from(new Set(items.map((comment) => comment.user_id)))
      const entries = await Promise.all(
        userIds.map(async (userId) => {
          const userData = await getUserById(String(userId))
          return [userId, userData.username] as const
        })
      )

      setCommentAuthors(Object.fromEntries(entries))
    }

    const loadData = async (videoId: string) => {
      const videoData = await getVideoById(videoId)
      const ownerData = await getUserById(String(videoData.user_id))
      const commentsData: Comment[] = await getCommentsByVideo(videoId)
      const recommendedData = await getRecommendedVideos()

      setVideo(videoData)
      setOwner(ownerData)
      setComments(commentsData)
      setRecommended(recommendedData)
      setEditTitle(videoData.title)
      setEditDescription(videoData.description)
      setEditThumbnailUrl(videoData.thumbnail_url)
      setEditOpen(false)
      setMessage("")
      await loadCommentAuthors(commentsData)
    }

    if (id) {
      loadData(id)
    }
  }, [id])

  const reloadComments = async () => {
    if (!id) return

    const commentsData: Comment[] = await getCommentsByVideo(id)
    const userIds = Array.from(new Set(commentsData.map((comment) => comment.user_id)))
    const entries = await Promise.all(
      userIds.map(async (userId) => {
        const userData = await getUserById(String(userId))
        return [userId, userData.username] as const
      })
    )

    setComments(commentsData)
    setCommentAuthors(Object.fromEntries(entries))
  }

  const handleCreateComment = async (content: string) => {
    if (!video) return

    await createComment(video.id, content)
    await reloadComments()
  }

  const handleUpdateComment = async (commentId: number, content: string) => {
    await updateComment(commentId, content)
    await reloadComments()
  }

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm("Seguro que deseas eliminar este comentario?")
    if (!confirmed) return

    await deleteComment(commentId)
    await reloadComments()
  }

  const handleUpdateVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!video) return

    setSaving(true)
    setMessage("")

    try {
      const updatedVideo = await updateVideo(video.id, {
        title: editTitle,
        description: editDescription,
        thumbnailUrl: editThumbnailUrl.trim() || DEFAULT_THUMBNAIL_URL
      })

      setVideo(updatedVideo)
      setEditOpen(false)
      setMessage("Video actualizado.")
    }
    finally {
      setSaving(false)
    }
  }

  const handleDeleteVideo = async () => {
    if (!video) return

    const confirmed = window.confirm("Seguro que deseas borrar este video?")
    if (!confirmed) return

    await deleteVideo(video.id)
    navigate("/")
  }

  if (!video) {
    return <div className="px-4 py-8 text-zinc-400">Cargando...</div>
  }

  const isOwner = authUser?.id === video.user_id

  return (
    <Layout>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_402px]">

        <section>

          <VideoPlayer src={video.video_url} />

          <div className="mt-4">

            <h1 className="text-xl font-bold leading-7">
              {video.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  username={owner?.username}
                  avatarUrl={owner?.avatar_url}
                  className="h-10 w-10"
                />

                <div>
                  <p className="font-semibold">{owner?.username ?? "Usuario"}</p>
                </div>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditOpen((current) => !current)}
                    className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteVideo}
                    className="rounded-full bg-red-700 px-4 py-2 text-sm font-medium hover:bg-red-600"
                  >
                    Borrar
                  </button>
                </div>
              )}
            </div>

            {message && (
              <p className="mt-3 text-sm text-green-500">{message}</p>
            )}

            {isOwner && editOpen && (
              <form
                onSubmit={handleUpdateVideo}
                className="mt-4 flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4"
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  placeholder="Titulo"
                  className="rounded-md border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
                />

                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  placeholder="Descripcion"
                  className="h-28 rounded-md border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
                />

                <input
                  type="url"
                  value={editThumbnailUrl}
                  onChange={(event) => setEditThumbnailUrl(event.target.value)}
                  placeholder="URL de miniatura"
                  className="rounded-md border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={saving}
                  className="self-end rounded-full bg-zinc-50 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            )}

            <p className="mt-4 whitespace-pre-line rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-200">
              {video.description}
            </p>

          </div>

          <section className="mt-8">
            {isAuthenticated ? (
              <CommentForm onSubmit={handleCreateComment} />
            ) : (
              <p className="rounded-lg bg-zinc-900 p-4 text-sm text-zinc-300">
                Inicia sesion para comentar.
              </p>
            )}
          </section>

          <CommentList
            comments={comments}
            commentAuthors={commentAuthors}
            currentUserId={authUser?.id}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />

        </section>

        <aside>

          <h2 className="mb-4 text-base font-semibold">
            Videos recomendados
          </h2>

          <RecommendedVideos videos={recommended.filter((item) => item.id !== video.id)} />

        </aside>

      </div>

    </Layout>
  )
}
