import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post("https://your-api-url.com/login", {
            email,
            password,
          });

          const { token, user } = response.data;
          set({ token, user, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول",
            loading: false,
          });
        }
      },

      register: async (name, email, password) => {
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
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore;
