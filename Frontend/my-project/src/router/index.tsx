import { Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Watch from "../pages/Watch"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Upload from "../pages/Upload"
import Profile from "../pages/Profile"

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/watch/:id" element={<Watch />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/profile/:id" element={<Profile />} />
    </Routes>
  )
}