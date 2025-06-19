import { create } from "zustand";
import axiosInstance from "../config/api/axiosInstance";

const useBalanceStore = create((set, get) => ({
  balance: 0,
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

  deposit: async (couponCode) => {
    const { verified } = get();

    if (!verified) {
      set({ error: "يجب التحقق من الهوية أولاً قبل إجراء عملية الإيداع" });
      return null;
    }

    if (!couponCode || couponCode.trim().length < 5) {
      set({ error: "رقم الكوبون غير صحيح" });
      return null;
    }

    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.put(`/Auth/Deposit/${couponCode}`);

      if (response.status !== 200) {
        const errorMessage = response.data?.message || "فشل عملية الإيداع";
        set({ error: errorMessage, loading: false });
        return null;
      }

      // Check for specific error messages
      if (response.data === "this coupon is used before") {
        set({ error: "هذا الكوبون تم استخدامه من قبل", loading: false });
        return null;
      }

      // Validate response data
      // if (!response.data ) {
      //   set({ error: "استجابة غير صحيحة من الخادم", loading: false });
      //   return null;
      // }

      const currentBalance = get().balance;
      const depositAmount = response.data.amount || 0;
      const newBalance = currentBalance + depositAmount;

      

      set({
        balance: newBalance,
        loading: false,
      });

      return {
        balance: newBalance,
        depositedAmount: depositAmount,
        couponId: response.data.couponId,
      };
    } catch (error) {
      console.error("Error depositing:", error);
      let errorMessage = error.response?.data || "فشل عملية الإيداع";
      if (errorMessage === "this coupon is used before") {
        errorMessage = "هذا الكوبون تم استخدامه من قبل";
      } else if (errorMessage === "this Coupon doesn't exist") {
        errorMessage = "هذا الكوبون غير موجود";
      } 


      // if (error.response?.data === "this coupon is used before") {
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
      const response = await axiosInstance.get(`/Auth/Balance/Info`);

      if (response.status !== 200 || !response.data) {
        const errorMessage =
          response.data?.message || "فشل في جلب معلومات المستخدم";
        set({ error: errorMessage, loading: false });
        return null;
      }

      const userData = response.data;

      // Validate required fields
      if (
        typeof userData.balance === "undefined" ||
        typeof userData.isverified === "undefined"
      ) {
        set({ error: "استجابة غير صحيحة من الخادم", loading: false });
        return null;
      }

      let balance = userData.balance;
      let verified = userData.isverified;
      let premium = false;

      // Set premium status based on user type
      if (userData.userType === 1) {
        premium = userData.isPremium || false;
      }

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
      const errorMessage =
        error.response?.data?.message || "فشل في جلب معلومات المستخدم";
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  withdraw: async (amount) => {
    const { verified } = get();

    if (!verified) {
      set({ error: "يجب التحقق من الهوية أولاً قبل إجراء عملية السحب" });
      return null;
    }

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
    console.log("Withdrawing amount:", amount);

    // http://31.97.154.184:5000/api/Auth/withdraw?Balance=1

    try {
      const response = await axiosInstance.put(
        `/Auth/withdraw?Balance=${amount}`
      );

      console.log("Withdraw response:", response);

      const updatedBalance = get().balance - amount;
      const couponId = response.data.couponId;
      console.log("Coupon ID:", couponId);

      set({ balance: updatedBalance, loading: false });
      return { couponId, balance: updatedBalance };
    } catch (error) {
      console.error("Error withdrawing:", error);
      let errorMessage = error.response?.data || "فشل عملية السحب";
      if (errorMessage === "you have exeeded the allowed coupon value") {
         errorMessage = "لقد تجاوزت الحد المسموح به لقيمة الكوبون";
      } 
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
      const response = await axiosInstance.put(`/Tenant/premium`);

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
      set({
        error: "يجب أن تكون عضو بريميوم أولاً قبل الترقية للبريميوم المتقدم",
      });
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
