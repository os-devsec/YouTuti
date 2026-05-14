import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Home from "./pages/Home"
import Watch from "./pages/Watch"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Upload from "./pages/Upload"
import Profile from "./pages/Profile"

import Navbar from "./components/layout/Navbar"

import ProtectedRoute from "./components/auth/ProtectedRoute"

export default function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/watch/:id"
          element={<Watch />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile/:id"
          element={<Profile />}
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}