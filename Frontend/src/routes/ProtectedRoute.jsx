import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/auth.store";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { token, user, loading, loadUserFromToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // If we have a token but no user data, try to load user info
    if (token && !user && !loading) {
      loadUserFromToken();
    }
  }, [token, user, loading, loadUserFromToken]);

  // Show loading spinner or component while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isAuthenticated = token && user;

  if (requireAuth && !isAuthenticated) {
    // Redirect to login with the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // If user is authenticated but trying to access auth pages, redirect to dashboard
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
