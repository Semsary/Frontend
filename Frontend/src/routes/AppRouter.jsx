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
import Testing from "../temp-testing/Testing.jsx";
import SignupPage_tenant from "../pages/auth/tenant/SignUp.jsx";
import SignUp_landlord from "../pages/auth/landlord/SignUp.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    children: [
      {
        index: true,
        element: <SignupPage_tenant />,
      },
      {
        path: "landlord",
        element: <SignUp_landlord type="landlord" />,
      },
    ],
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
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
    path: "/test",
    element: <Testing />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
