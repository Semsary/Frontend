import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.user);
      setRole(res.data.role);
    } catch (error) {
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      await axiosInstance.post("/auth/login", credentials);
      await checkAuth();
      // navigate("/dashboard");
    } catch (error) {
      console.error(
        "فشل تسجيل الدخول:",
        error.response?.data?.message || error.message
      );
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      setRole(null);
      // navigate("/login");
    } catch (error) {
      console.error(
        "خطأ أثناء تسجيل الخروج:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
