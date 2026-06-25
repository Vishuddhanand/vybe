import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../features/auth/auth.context";

function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="loading-spinner-container" style={{ height: '100vh' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
