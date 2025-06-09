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
import SignupPage_tenant from "../pages/auth/tenant/SignUp.jsx";
import SignUp_landlord from "../pages/auth/landlord/SignUp.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";
import ErrorElement from "../pages/errors/ErrorElement.jsx";
import Profile from "../pages/profile/profile.jsx";
import ChatComponent2 from "../temp-testing/Chat copy.jsx";
import Chat from "../temp-testing/CChat.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/signup",
    children: [
      {
        index: true,
        element: <SignupPage_tenant />,
        errorElement: <ErrorElement />,
      },
      {
        path: "landlord",
        element: <SignUp_landlord type="landlord" />,
        errorElement: <ErrorElement />,
      },
    ],
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
    errorElement: <ErrorElement />,
  },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/login",
    element: <Login />,
    // errorElement: (
    //   <ErrorElement errorMessage="Login failed" title="Authentication Error" />
    // ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    // errorElement: <ErrorElement errorMessage="Password recovery failed" />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/verify-code",
    element: <VerifyCode />,
    // errorElement: <ErrorElement errorMessage="Verification failed" />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/Chat",
    element: <Chat />,
    // errorElement: <ErrorElement errorMessage="Verification failed" />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    // errorElement: <ErrorElement errorMessage="Password reset failed" />,
    errorElement: <ErrorElement />,
  },

  
 
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
