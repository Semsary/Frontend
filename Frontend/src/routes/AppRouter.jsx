import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import HomePage from "../pages/home/HomePage.jsx";
import PropertyDetailsPage from "../pages/home/PropertyDetailsPage.jsx";
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
import BookingPage from "../pages/home/BookingPage.jsx";
import Notifications from "../pages/Notifications.jsx";
import BalanceManagement from "../pages/Balance/BalanceManagement.jsx";
import Page404 from "../components/errors/Page404.jsx";


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
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupPage_tenant />
          </ProtectedRoute>
        ),
        errorElement: <ErrorElement />,
      },
      {
        path: "landlord",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignUp_landlord type="landlord" />
          </ProtectedRoute>
        ),
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
    element: (
      <ProtectedRoute requireAuth={false}>
        <Login />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/forgot-password",
    element: (
      <ProtectedRoute requireAuth={false}>
        <ForgotPassword />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/verify-code",
    element: (
      <ProtectedRoute requireAuth={false}>
        <VerifyCode />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/Chat",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/Chat/:id",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/reset-password",
    element: (
      <ProtectedRoute requireAuth={false}>
        <ResetPassword />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/ad/:id",
    element: <PropertyDetailsPage />,
    errorElement: <ErrorElement />,
  },
  {
    path: "/booking/:id",
    element: (
      <ProtectedRoute>
        <BookingPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/wallet",
    element: (
      <ProtectedRoute>
        <BalanceManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/*",
    element: <Page404 />,
    errorElement: <ErrorElement />,
  },



]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
