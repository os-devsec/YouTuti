interface Props {
  src: string
}

export default function VideoPlayer({ src }: Props) {
  return (
    <video
      key={src}
      src={src}
      controls
      className="aspect-video w-full rounded-lg bg-black"
    />
  )
}
