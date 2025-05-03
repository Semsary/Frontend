import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import axiosInstance from "./../config/api/axiosInstance";
import { translateError } from "../functions/HandleServerErorrs";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      email: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post("/Auth/login", {
            email,
            password
          });
       
          const { data } = response;
          set({ token: data, user: "one", loading: false });
          return true;
        } catch (err) {
          console.log("Error loging response", err);
          set({
            error: err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول",
            loading: false,
          });
          return false;
        }
      },

      register_tenant: async (signupData) => {
        set({ loading: true, error: null });
        const { firstName, lastName, email, password } = signupData;
        try {
          const response = await axiosInstance.post("/Auth/Tenant/register", {
            firstName,
            lastName,
            email,
            password,
          });
          console.log(response);
          set({ loading: false, email: email });

          return true;
        } catch (err) {
          const translated = translateError(err?.response?.data);
          const message =
            (typeof translated === "string" && translated) ||
            err?.message ||
            "حدث خطأ أثناء إنشاء الحساب";
          set({
            error: message,  
            loading: false,
          });
        }
        return false;

      },

      register_landlord: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            "https://your-api-url.com/register",
            {
              name,
              email,
              password,
            }
          );

          const { token, user } = response.data;
          set({ token, user, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب",
            loading: false,
          });
        }
      },

      verifyEmail: async (email, code) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.post("/Auth/verifyEmail", {
            email,
            otp: code,
          });
          set({ loading: false });
          return true;
        } catch (err) {
          set({
            error:
              translateError(err.response?.data) ||
              "فشل التحقق من البريد الإلكتروني",
            loading: false,
          });
          return false;
        }
      },

      loadUserFromToken: async () => {
        const token = get().token;
        if (!token) return;

        set({ loading: true, error: null });
        try {
          const response = await axios.get("https://your-api-url.com/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ user: response.data, loading: false });
        } catch (err) {
          set({
            error: "فشل تحميل بيانات المستخدم",
            loading: false,
          });
        }
      },

      resetPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          await axios.post("https://your-api-url.com/reset-password", {
            email,
          });
          set({ loading: false });
        } catch (err) {
          set({
            error: "فشل في إرسال رابط الاسترجاع",
            loading: false,
          });
        }
      },

      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        email: state.email,
      }),
    }
  )
);

export default useAuthStore;
