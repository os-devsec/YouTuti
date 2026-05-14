import api from "../api/axios"

export const getCategories = async () => {

  const response = await api.get(
    "/categories"
  )

  return response.data
}

export const getCategoryVideos = async (
  id: number
) => {

  const response = await api.get(
    `/categories/${id}/videos`
  )

  return response.data
}
