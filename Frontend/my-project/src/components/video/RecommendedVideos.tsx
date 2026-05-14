import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import UserAvatar from "../common/UserAvatar"
import { getUserById } from "../../services/auth.service"
import type { User } from "../../types/user"
import type { Video } from "../../types/video"

interface Props {
  videos: Video[]
}

export default function RecommendedVideos({
  videos
}: Props) {

  const [owners, setOwners] = useState<Record<number, User>>({})

  useEffect(() => {
    const loadOwners = async () => {
      const userIds = Array.from(new Set(videos.map((video) => video.user_id)))
      const entries = await Promise.all(
        userIds.map(async (userId) => {
          const userData = await getUserById(String(userId))
          return [userId, userData] as const
        })
      )

      setOwners(Object.fromEntries(entries))
    }

    if (videos.length > 0) {
      loadOwners()
    }
  }, [videos])

  return (
    <div className="flex flex-col gap-3">

      {videos.map((video) => (
        <Link
          key={video.id}
          to={`/watch/${video.id}`}
          className="grid grid-cols-[168px_1fr] gap-2 rounded-lg hover:bg-zinc-900"
        >
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="aspect-video w-full rounded-lg object-cover"
          />

          <div className="min-w-0 pr-2">
            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-50">
              {video.title}
            </h3>

            <div className="mt-1 flex items-center gap-2">
              <UserAvatar
                username={owners[video.user_id]?.username}
                avatarUrl={owners[video.user_id]?.avatar_url}
                className="h-5 w-5 shrink-0"
              />

              <p className="min-w-0 truncate text-xs text-zinc-400">
                {owners[video.user_id]?.username ?? "Usuario"}
              </p>
            </div>

          </div>
        </Link>
      ))}

    </div>
  )
}
