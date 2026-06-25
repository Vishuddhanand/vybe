import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Feed from "../features/post/pages/Feed"
import CreatePost from "../features/post/pages/CreatePost";
import Profile from "../features/post/pages/Profile";
import Search from "../features/post/pages/Search";
import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;

