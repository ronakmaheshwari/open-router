import { useAuth } from "@/providers/authContext";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};
export default ProtectedRoute