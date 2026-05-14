import { Link } from "react-router-dom"

const items = [
  { to: "/", icon: "I", label: "Inicio" },
  { to: "/upload", icon: "+", label: "Subir" }
]

export default function Sidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-60 shrink-0 overflow-y-auto bg-[#0f0f0f] px-3 py-3 lg:block">
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex h-10 items-center gap-5 rounded-lg px-3 text-sm text-zinc-100 hover:bg-zinc-800"
          >
            <span className="w-5 text-center text-base font-semibold">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
