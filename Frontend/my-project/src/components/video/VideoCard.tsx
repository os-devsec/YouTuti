import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import UserAvatar from "../common/UserAvatar"
import { getUserById } from "../../services/auth.service"
import type { User } from "../../types/user"
import type { Video } from "../../types/video"

interface Props {
  video: Video
}

export default function VideoCard({
  video
}: Props) {

  const [owner, setOwner] = useState<User | null>(null)

  useEffect(() => {
    const loadOwner = async () => {
      const userData = await getUserById(String(video.user_id))
      setOwner(userData)
    }

    loadOwner()
  }, [video.user_id])

  return (
    <Link to={`/watch/${video.id}`} className="group block">

      <article>

        <div className="relative overflow-hidden rounded-lg bg-zinc-900">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="
              w-full
              aspect-video
              object-cover
              transition
              duration-200
              group-hover:scale-[1.02]
            "
          />
        </div>

        <div className="mt-3 flex gap-3">
          <UserAvatar
            username={owner?.username}
            avatarUrl={owner?.avatar_url}
            className="mt-0.5 h-9 w-9 shrink-0"
          />

          <div className="min-w-0">
            <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-50">
              {video.title}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              {owner?.username ?? "Usuario"}
            </p>

          </div>

        </div>

      </article>

    </Link>
  )
}
