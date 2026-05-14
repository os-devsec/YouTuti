import type { Video } from "../../types/video"
import VideoCard from "./VideoCard"

interface Props {
  videos: Video[]
}

export default function VideoGrid({
  videos
}: Props) {

  return (
    <section
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
        gap-x-4
        gap-y-9
      "
    >

      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
        />
      ))}

    </section>
  )
}
