
import {
  Navigate
} from "react-router-dom"

import useAuth from "../../hooks/useAuth"

import Loading from "../common/Loading"

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({
  children
}: Props) {

  const {
    loading,
    isAuthenticated
  } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}