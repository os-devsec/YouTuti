
import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../services/auth.service"
import { notifyAuthChanged } from "../hooks/useAuth"

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const responseError = error as {
      response?: {
        data?: {
          detail?: string
        }
      }
    }

    return responseError.response?.data?.detail ?? fallback
  }

  return fallback
}

export default function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const handleSubmit = async (
    e: FormEvent
  ) => {

    e.preventDefault()

    try {

      setLoading(true)

      setError("")

      const response = await loginUser({
        email,
        password
      })

      localStorage.setItem(
        "token",
        response.access_token
      )

      notifyAuthChanged()

      navigate("/")
    }
    catch (error) {

      setError(
        getErrorMessage(error, "Invalid credentials")
      )
    }
    finally {

      setLoading(false)
    }
  }

  return (

    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-black
        px-4
      "
    >

      <form
        onSubmit={handleSubmit}
        className="
          bg-zinc-900
          p-8
          rounded-2xl
          w-full
          max-w-md
        "
      >

        <h1 className="text-3xl font-bold mb-8">
          Login
        </h1>

        <div className="flex flex-col gap-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              bg-zinc-800
              p-4
              rounded-xl
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              bg-zinc-800
              p-4
              rounded-xl
            "
          />

          {
            error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )
          }

          <button
            disabled={loading}
            className="
              bg-blue-600
              hover:bg-blue-700
              transition
              p-4
              rounded-xl
              font-semibold
            "
          >
            {
              loading
                ? "Loading..."
                : "Login"
            }
          </button>

        </div>

      </form>

    </main>
  )
}
