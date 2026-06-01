import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;