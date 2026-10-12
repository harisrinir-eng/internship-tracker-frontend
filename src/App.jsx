import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Internships from "./pages/Internships.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/internships" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Any logged-in user */}
        <Route path="/internships" element={<ProtectedRoute><Internships /></ProtectedRoute>} />

        {/* Role-specific pages */}
        <Route path="/student" element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
