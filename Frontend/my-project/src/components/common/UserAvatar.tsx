interface Props {
  username?: string
  avatarUrl?: string | null
  className?: string
}

export default function UserAvatar({
  username = "U",
  avatarUrl,
  className = "h-9 w-9"
}: Props) {
  const fallback = username.slice(0, 1).toUpperCase()

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={`${className} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${className} grid place-items-center rounded-full bg-blue-600 text-xs font-bold`}>
      {fallback}
    </div>
  )
}
