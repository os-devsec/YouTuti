import api from "../api/axios"

export const getCommentsByVideo = async (
  videoId: string
) => {

  const response = await api.get(
    `/comments/video/${videoId}`
  )

  return response.data
}

export const createComment = async (
  video_id: number,
  content: string
) => {

  const response = await api.post(
    "/comments",
    {
      video_id,
      content
    }
  )

  return response.data
}

export const updateComment = async (
  id: number,
  content: string
) => {

  const response = await api.put(
    `/comments/${id}`,
    { content }
  )

  return response.data
}

export const deleteComment = async (
  id: number
) => {

  const response = await api.delete(
    `/comments/${id}`
  )

  return response.data
}
