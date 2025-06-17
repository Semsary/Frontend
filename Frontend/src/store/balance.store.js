import { create } from "zustand";
import axiosInstance from "../config/api/axiosInstance";

const useBalanceStore = create((set, get) => ({
  balance: null,
  premium: false,
  verified: false,
  loading: false,
  error: null,

  // Clear error method
  clearError: () => set({ error: null }),

  // Fetch current balance
  fetchBalance: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/Auth/balance`);
      set({ balance: response.data.balance, loading: false });
      return response.data.balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      const errorMessage = error.response?.data?.message || "فشل في جلب الرصيد";
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  deposit: async (value) => {
    if (!value || value <= 0) {
      set({ error: "يجب إدخال قيمة صحيحة للإيداع" });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(`/api/Auth/deposit`, {
        amount: value,
      });

      const newBalance = response.data.balance;
      set({ balance: newBalance, loading: false });
      return newBalance;
    } catch (error) {
      console.error("Error depositing:", error);
      const errorMessage = error.response?.data?.message || "فشل عملية الإيداع";
      set({
        error: errorMessage,
        loading: false,
      });
      return null;
    }
  },

  getUserInfo: async () => {
    set({ loading: true, error: null });
    try {
      // In real implementation, this would be an API call
      const balance = 1080; // Mock balance for demonstration
      const premium = false; // Mock premium status
      const verified = true; // Mock verification status

      set({
        balance,
        premium,
        verified,
        loading: false,
      });

      return {
        balance,
        premium,
        verified,
      };
    } catch (error) {
      console.error("Error fetching user info:", error);
      const errorMessage = "فشل في جلب معلومات المستخدم";
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  withdraw: async (amount) => {
    if (!amount || amount <= 0) {
      set({ error: "يجب إدخال قيمة صحيحة للسحب" });
      return null;
    }

    const currentBalance = get().balance;
    if (currentBalance !== null && amount > currentBalance) {
      set({ error: "المبلغ المطلوب سحبه أكبر من الرصيد المتاح" });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(`/api/Auth/withdraw`, {
        amount: amount,
      });

      const updatedBalance = response.data.balance;
      const couponId = response.data.couponId;

      set({ balance: updatedBalance, loading: false });
      return { couponId, balance: updatedBalance };
    } catch (error) {
      console.error("Error withdrawing:", error);
      const errorMessage = error.response?.data?.message || "فشل عملية السحب";
      set({
        error: errorMessage,
        loading: false,
      });
      return null;
    }
  },

  // Add method to request premium status
  requestPremium: async () => {
    const { verified } = get();

    if (!verified) {
      set({ error: "يجب التحقق من الهوية أولاً قبل طلب الترقية للبريميوم" });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(`/api/Auth/request-premium`);

      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error requesting premium status:", error);
      const errorMessage =
        error.response?.data?.message || "فشل في طلب الترقية للبريميوم";
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  // Add method to upgrade to really premium
  upgradeToReallyPremium: async () => {
    const { verified, premium } = get();

    if (!verified) {
      set({ error: "يجب التحقق من الهوية أولاً" });
      return null;
    }

    if (!premium) {
      set({ error: "يجب أن تكون عضو بريميوم أولاً قبل الترقية للبريميوم المتقدم" });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/api/Auth/upgrade-really-premium`
      );

      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error upgrading to really premium:", error);
      const errorMessage =
        error.response?.data?.message || "فشل في ترقية البريميوم المتقدم";
      set({ error: errorMessage, loading: false });
      return null;
    }
  },
}));

export default useBalanceStore;
