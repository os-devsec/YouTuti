import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { registerUser } from "../services/auth.service"

export default function Register() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

    const handleSubmit = async (
    e: FormEvent
  ) => {

    e.preventDefault()

    try {

      setLoading(true)

      await registerUser({
        username,
        email,
        password
      })

      navigate("/login")
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-8">
          Register
        </h1>

        <div className="flex flex-col gap-5">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-800 p-4 rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 p-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 p-4 rounded-xl"
          />

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl"
          >
            {
              loading
                ? "Loading..."
                : "Register"
            }
          </button>

        </div>

      </form>

    </div>
  )
}
