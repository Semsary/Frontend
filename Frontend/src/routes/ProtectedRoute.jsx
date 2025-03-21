import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true;
  const location = useLocation();

  if (isAuthenticated) {
    return children;
  }

  const redirectPaths = {
    "/dashboard": "/login",
    "/dashboard/users": "/signup",
    "/dashboard/add-student": "/403",
  };

  const redirectTo = redirectPaths[location.pathname] || "/";

  return <Navigate to={redirectTo} state={{ from: location }} replace />;
};

export default ProtectedRoute;
