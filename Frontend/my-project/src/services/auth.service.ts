import api from "../api/axios"

interface RegisterData {
  username: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

export const registerUser = async (
  data: RegisterData
) => {

  const response = await api.post(
    "/auth/register",
    data
  )

  return response.data
}

export const loginUser = async (
  data: LoginData
) => {

  const response = await api.post(
    "/auth/login",
    data
  )

  return response.data
}

export const getUserById = async (
  id: string
) => {

  const response = await api.get(
    `/users/${id}`
  )

  return response.data
}

export const updateProfile = async (
  username: string
) => {

  const response = await api.put(
    "/users/me",
    { username }
  )

  return response.data
}

export const uploadAvatar = async (avatarUrl: string) => {
  const formData = new FormData()

  formData.append("avatar_url", avatarUrl)

  const response = await api.patch(
    "/users/me/avatar",
    formData
  )

  return response.data
}
