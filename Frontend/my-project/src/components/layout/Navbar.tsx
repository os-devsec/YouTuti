import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import UserAvatar from "../common/UserAvatar"
import { getUserById } from "../../services/auth.service"
import useAuth from "../../hooks/useAuth"
import type { User } from "../../types/user"

export default function Navbar() {

  const {
    user,
    isAuthenticated,
    logout
  } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [profile, setProfile] = useState<User | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        return
      }

      const userData = await getUserById(String(user.id))
      setProfile(userData)
    }

    loadProfile()
  }, [user?.id])

  const visibleProfile = user?.id ? profile : null

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanQuery = query.trim()

    navigate(cleanQuery ? `/?q=${encodeURIComponent(cleanQuery)}` : "/")
  }

  return (

    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#0f0f0f]">

      <nav className="flex h-14 items-center justify-between gap-4 px-4">

        <div className="flex min-w-fit items-center gap-4">

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xl font-semibold tracking-normal text-white"
          >
            <span className="grid h-6 w-9 place-items-center rounded-md bg-blue-600 text-[10px] text-white">
              Play
            </span>
            YouTuTi
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden w-full max-w-2xl items-center md:flex">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar"
            className="h-10 min-w-0 flex-1 rounded-l-full border border-zinc-700 bg-[#121212] px-5 text-sm text-zinc-100 outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="grid h-10 w-20 place-items-center rounded-r-full border border-l-0 border-zinc-700 bg-zinc-800 text-xs font-semibold hover:bg-zinc-700"
            aria-label="Buscar"
          >
            Buscar
          </button>
        </form>

        <div className="flex min-w-fit items-center gap-2">

          <Link
            to="/upload"
            className="rounded-full bg-zinc-800 px-3 py-2 text-sm font-medium hover:bg-zinc-700"
          >
            + Crear
          </Link>

          {
            isAuthenticated
              ? (
                <>
                  <Link
                    to={`/profile/${user?.id}`}
                    aria-label="Perfil"
                  >
                    <UserAvatar
                      username={visibleProfile?.username}
                      avatarUrl={visibleProfile?.avatar_url}
                      className="h-9 w-9"
                    />
                  </Link>

                  <button
                    onClick={logout}
                    className="rounded-full px-3 py-2 text-sm hover:bg-zinc-800"
                  >
                    Salir
                  </button>
                </>
              )
              : (
                <div className="flex items-center gap-2">

                  <Link
                    to="/login"
                    className="rounded-full px-3 py-2 text-sm hover:bg-zinc-800"
                  >
                    Acceder
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-full border border-blue-500 px-3 py-2 text-sm text-blue-400 hover:bg-blue-950"
                  >
                    Crear cuenta
                  </Link>

                </div>
              )
          }

        </div>

      </nav>

    </header>
  )
}
