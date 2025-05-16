import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
