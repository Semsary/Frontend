import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "./../config/api/axiosInstance";
import { translateError } from "../functions/HandleServerErorrs";
import useNotificationStore from "./notification.store";

/**
 * Auth Store to manage user authentication and profile data
 * This store handles login, registration, password reset, and user data loading
 */

const fcmStore = useNotificationStore.getState();
const DeviceTokens = fcmStore.FCMToken || "";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      email: null,
      rest_pass_email: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post("/Auth/login", {
            email,
            password,
            deviceToken: DeviceTokens,
          });
          // console.log("Login response:", response);
          const { data } = response;
          set({ token: data.token, loading: false });
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
            DeviceTokens: "",
          });
          console.log(response);
          set({ loading: false, email: email });

          return true;
        } catch (err) {
          console.log("Error in register tenant", err);
          const translated = translateError(err?.response?.data);
          const message = translated || "حدث خطأ أثناء إنشاء الحساب";
          set({
            error: message,
            loading: false,
          });
        }
        return false;
      },

      register_landlord: async (firstname, lastname, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post("/Auth/Landlord/register", {
            firstname,
            lastname,
            email,
            password,
          });
          console.log("Response from register landlord:", response);
          const { token, user } = response.data;
          set({ token, user, loading: false, email });
          return true;
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
          const res = await axiosInstance.post("/Auth/verifyEmail", {
            email,
            otp: code,
          });

          set({ loading: false });
          return true;
        } catch (err) {
          console.log("Error in verify email", err);
          set({
            error:
              translateError(err.response?.data) ||
              "فشل التحقق من البريد الإلكتروني",
            loading: false,
          });
          return false;
        }
      },

      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get("/Auth/UpdatePasword", {
            params: { email },
          });

          set({
            loading: false,
            rest_pass_email: email,
          });
          return true;
        } catch (err) {
          console.log("Error in forgot password", err);
          const translated = translateError(err?.response?.data);
          const message =
            (typeof translated === "string" && translated) ||
            "حدث خطأ أثناء إرسال رابط الاسترجاع";
          set({
            error: message,
            loading: false,
          });
          return false;
        }
      },

      resetPassword: async (email, otp, newPassword) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post("/Auth/resetpassword", {
            email,
            otp,
            password: newPassword,
          });
          set({
            loading: false,
            rest_pass_email: null,
          });

          return true;
        } catch (err) {
          console.log("Error in reset password", err);
          const translated = translateError(err?.response?.data);
          const message =
            (typeof translated === "string" && translated) ||
            "حدث خطأ أثناء إعادة تعيين كلمة المرور";
          set({
            error: message,
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
          const response1 = await axiosInstance.get("/Auth/GetUserInfo");

          set({ user: response1.data, loading: false });
        } catch (err) {
          set({
            error: "فشل تحميل بيانات المستخدم",
            loading: false,
          });
        }
      },

      getUser: async () => {
        const token = get().token;
        if (!token) return null;
        try {
          const response1 = await axiosInstance.get("/Auth/GetUserInfo");
          // console.log("User -- -- data:", response1.data);
          return response1.data;
        } catch (err) {
          console.error("Error fetching user data:", err);
          return null;
        }
      },

      // resetPassword: async (email) => {
      //   set({ loading: true, error: null });
      //   try {
      //     await axios.post("https://your-api-url.com/reset-password", {
      //       email,
      //     });
      //     set({ loading: false });
      //   } catch (err) {
      //     set({
      //       error: "فشل في إرسال رابط الاسترجاع",
      //       loading: false,
      //     });
      //   }
      // },

      // Add authentication check method
      isAuthenticated: () => {
        const { token, user } = get();
        return !!(token && user);
      },

      logout: () => {
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("user-storage");
        set({ token: null, user: null, error: null });
        console.log("User logged out successfully");
        // Optionally redirect to home page
        window.location.href = "/";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        email: state.email,
        rest_pass_email: state.rest_pass_email,
      }),
    }
  )
);

export default useAuthStore;
