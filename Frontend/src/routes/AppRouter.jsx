import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import HomePage from "../pages/home/HomePage.jsx";
import Login from "../pages/auth/Login.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import VerifyCode from "../pages/auth/VerifyCode.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import SignUp from "../pages/auth/SignUp.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
    // errorElement: (
    //   <ErrorElement errorMessage="Login failed" title="Authentication Error" />
    // ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    // errorElement: <ErrorElement errorMessage="Password recovery failed" />,
  },
  {
    path: "/verify-code",
    element: <VerifyCode />,
    // errorElement: <ErrorElement errorMessage="Verification failed" />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    // errorElement: <ErrorElement errorMessage="Password reset failed" />,
  },
  {
    path: "/signup",
    element:<SignUp/>
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
