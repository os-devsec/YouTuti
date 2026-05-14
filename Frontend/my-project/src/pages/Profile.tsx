import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useParams } from "react-router-dom"

import { getUserById, uploadAvatar } from "../services/auth.service"
import { getVideosByUser } from "../services/video.service"
import useAuth from "../hooks/useAuth"
import type { User } from "../types/user"
import type { Video } from "../types/video"

import VideoGrid from "../components/video/VideoGrid"

export default function Profile() {

  const { id } = useParams()
  const { user: authUser } = useAuth()

  const [user, setUser] = useState<User | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarMessage, setAvatarMessage] = useState("")

  useEffect(() => {
    const loadProfile = async (
      userId: string
    ) => {

      const userData = await getUserById(userId)
      const videosData = await getVideosByUser(userId)

      setUser(userData)
      setVideos(videosData)
      setAvatarUrl(userData.avatar_url ?? "")
    }

    if (id) {
      loadProfile(id)
    }

  }, [id])

  const handleAvatarSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAvatarMessage("")

    const updatedUser = await uploadAvatar(avatarUrl)
    setUser(updatedUser)
    setAvatarMessage("Imagen de perfil actualizada.")
  }

  if (!user) {
    return <div className="px-4 py-8 text-zinc-400">Cargando...</div>
  }

   return (
    <main className="mx-auto max-w-7xl px-4 py-8">

      <section className="mb-10">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          <img
            src={user.avatar_url || "https://placehold.co/160x160?text=ST"}
            alt={user.username}
            className="h-28 w-28 rounded-full object-cover"
          />

          <div className="min-w-0">

            <h1 className="text-3xl font-bold text-zinc-50">
              {user.username}
            </h1>

            <p className="text-zinc-400">
              {videos.length} videos
            </p>

          </div>

        </div>

        {authUser?.id === Number(id) && (
          <form onSubmit={handleAvatarSubmit} className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="URL de imagen de perfil en S3"
              className="min-w-0 flex-1 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm outline-none focus:border-blue-500"
            />

            <button className="rounded-full bg-zinc-50 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
              Actualizar
            </button>
          </form>
        )}

        {avatarMessage && (
          <p className="mt-2 text-sm text-green-500">{avatarMessage}</p>
        )}

      </section>

      <VideoGrid videos={videos} />

    </main>
  )
}
