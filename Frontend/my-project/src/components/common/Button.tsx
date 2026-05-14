import type { ButtonHTMLAttributes, ReactNode } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({
  children,
  className = "",
  ...props
}: Props) {

  return (
    <button
      className={`
        bg-blue-600
        hover:bg-blue-700
        transition
        rounded-xl
        px-5
        py-3
        font-semibold
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
