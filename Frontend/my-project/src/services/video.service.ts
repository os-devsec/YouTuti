import api from "../api/axios"

export interface UploadVideoData {
  title: string
  description: string
  categoryId: number
  videoUrl: string
  thumbnailUrl?: string
}

export const getVideos = async (
  page = 1,
  limit = 20
) => {

  const response = await api.get(
    `/videos?page=${page}&limit=${limit}`
  )

  return response.data
}

export const getVideoById = async (
  id: string
) => {

  const response = await api.get(
    `/videos/${id}`
  )

  return response.data
}

export const searchVideos = async (
  query: string
) => {

  const response = await api.get(
    `/videos/search?q=${encodeURIComponent(query)}`
  )

  return response.data
}

export const getRecommendedVideos = async () => {

  const response = await api.get(
    "/videos/recommended"
  )

  return response.data
}

export const getRecentVideos = async () => {

  const response = await api.get(
    "/videos/recent"
  )

  return response.data
}

export const getVideosByUser = async (
  userId: string
) => {

  const response = await api.get(
    `/users/${userId}/videos`
  )

  return response.data
}

export const uploadVideo = async (data: UploadVideoData) => {
  const formData = new FormData()

  formData.append("title", data.title)
  formData.append("description", data.description)
  formData.append("category_id", String(data.categoryId))
  formData.append("video_url", data.videoUrl)

  if (data.thumbnailUrl) {
    formData.append("thumbnail_url", data.thumbnailUrl)
  }

  const response = await api.post(
    "/videos",
    formData
  )

  return response.data
}

export interface UpdateVideoData {
  title: string
  description: string
  thumbnailUrl: string
}

export const updateVideo = async (
  id: number,
  data: UpdateVideoData
) => {
  const videoData = new FormData()

  videoData.append("title", data.title)
  videoData.append("description", data.description)

  await api.put(
    `/videos/${id}`,
    videoData
  )

  const thumbnailData = new FormData()
  thumbnailData.append("thumbnail_url", data.thumbnailUrl)

  const response = await api.patch(
    `/videos/${id}/thumbnail`,
    thumbnailData
  )

  return response.data
}

export const deleteVideo = async (
  id: number
) => {

  const response = await api.delete(
    `/videos/${id}`
  )

  return response.data
}
