import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Layout from "../components/layout/Layout"
import VideoGrid from "../components/video/VideoGrid"
import { getVideos, searchVideos } from "../services/video.service"
import { getCategories, getCategoryVideos } from "../services/category.service"
import type { Category } from "../types/category"
import type { Video } from "../types/video"

export default function Home() {

  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      }
      catch (error) {
        console.error(error)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    const loadVideos = async () => {
      try {
        if (query.trim()) {
          const data = await searchVideos(query)
          setVideos(data)
          return
        }

        if (activeCategoryId) {
          const data = await getCategoryVideos(activeCategoryId)
          setVideos(data)
          return
        }

        const data = await getVideos()
        setVideos(data.data)
      }
      catch (error) {
        console.error(error)
      }
    }

    loadVideos()
  }, [query, activeCategoryId])

  return (
    <Layout>

      <div className="sticky top-14 z-30 -mx-4 mb-5 flex gap-3 overflow-x-auto bg-[#0f0f0f] px-4 py-3 lg:-mx-6 lg:px-6">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategoryId(category.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-zinc-700 ${
              activeCategoryId === category.id && !query
                ? "bg-zinc-50 text-zinc-950"
                : "bg-zinc-800 text-zinc-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {query && (
        <h1 className="mb-5 text-xl font-semibold">
          Resultados para "{query}"
        </h1>
      )}

      {!query && activeCategoryId && (
        <button
          type="button"
          onClick={() => setActiveCategoryId(null)}
          className="mb-5 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700"
        >
          Ver todos los videos
        </button>
      )}

      <VideoGrid videos={videos} />

    </Layout>
  )
}
