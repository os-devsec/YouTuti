import type { ReactNode } from "react"
import Sidebar from "./Sidebar"

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-4 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  )
}
