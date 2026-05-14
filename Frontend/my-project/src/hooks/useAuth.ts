import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  sub: string
  exp: number
}

interface AuthUser {
  id: number
}

const AUTH_CHANGE_EVENT = "auth-change"

const getInitialUser = (): AuthUser | null => {
  try {

    const token = localStorage.getItem("token")

    if (!token) {
      return null
    }

    const decoded = jwtDecode<JwtPayload>(token)

    const currentTime = Date.now() / 1000

    if (decoded.exp < currentTime) {

      localStorage.removeItem("token")

      return null
    }

    return {
      id: Number(decoded.sub)
    }

  }
  catch (error) {

    console.error(error)

    localStorage.removeItem("token")

    return null
  }
}

export const notifyAuthChanged = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export default function useAuth() {

  const [user, setUser] = useState<AuthUser | null>(getInitialUser)

  const loading = false

  useEffect(() => {
    const syncUser = () => {
      setUser(getInitialUser())
    }

    window.addEventListener(AUTH_CHANGE_EVENT, syncUser)
    window.addEventListener("storage", syncUser)

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser)
      window.removeEventListener("storage", syncUser)
    }
  }, [])

  const logout = () => {

    localStorage.removeItem("token")

    setUser(null)

    notifyAuthChanged()
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout
  }
}
