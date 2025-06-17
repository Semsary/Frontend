import { useState } from "react";

export const useBalanceStore = () => {
  const [balance, setBalance] = useState(15420.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deposit = async (couponId) => {
    setLoading(true);
    // Simulate coupon validation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock coupon validation (you can add real validation logic here)
    if (!couponId || couponId.length < 5) {
      setError("رقم الكوبون غير صحيح");
      setLoading(false);
      return null;
    }

    // Mock amount from coupon (in real implementation, this would come from backend)
    const couponAmount = Math.floor(Math.random() * 1000) + 100; // Random amount between 100-1100
    setBalance((prev) => prev + couponAmount);
    setLoading(false);
    return { success: true, amount: couponAmount };
  };

  const withdraw = async (amount) => {
    if (amount > balance) {
      setError("المبلغ المطلوب سحبه أكبر من الرصيد المتاح");
      return null;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBalance((prev) => prev - amount);
    setLoading(false);
    return {
      couponId: `C${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };
  };

  const fetchBalance = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const transferToPremium = async () => {
    const premiumFee = 100; // 100 EGP

    if (balance < premiumFee) {
      setError("الرصيد غير كافي لترقية الحساب. المطلوب 100 جنيه مصري");
      return null;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setBalance((prev) => prev - premiumFee);
    setLoading(false);

    return { success: true, fee: premiumFee };
  };

  const clearError = () => setError("");

  return {
    balance,
    loading,
    error,
    deposit,
    withdraw,
    transferToPremium,
    fetchBalance,
    clearError,
  };
};
