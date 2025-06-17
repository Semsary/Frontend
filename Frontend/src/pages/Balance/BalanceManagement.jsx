import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, TrendingUp, Eye, EyeOff, Crown, RefreshCw, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import useBalanceStore from '../../store/balance.store';
import MessageModal from './components/MessageModal';
import CouponModal from './components/CouponModal';
import DepositCard from './components/DepositCard';
import WithdrawCard from './components/WithdrawCard';

const BalanceManagement = () => {
  const {
    balance,
    premium,
    verified,
    loading,
    error,
    deposit,
    withdraw,
    fetchBalance,
    getUserInfo,
    clearError,
    requestPremium,
    upgradeToReallyPremium
  } = useBalanceStore();
  const [successMessage, setSuccessMessage] = useState('');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [withdrawnCoupon, setWithdrawnCoupon] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageType, setMessageType] = useState('');

  // Fetch user info on component mount (which includes balance)
  useEffect(() => {
    getUserInfo();
  }, []);

  // Clear messages when switching tabs
  useEffect(() => {
    setSuccessMessage('');
    clearError();
  }, []);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      setShowMessageModal(true);
      setMessageType('success');
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setShowMessageModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      setShowMessageModal(true);
      setMessageType('error');
      const timer = setTimeout(() => {
        clearError();
        setShowMessageModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDeposit = async (value) => {
    setSuccessMessage('');
    clearError();

    const result = await deposit(parseFloat(value));

    if (result !== null) {
      setSuccessMessage(`تم إيداع ${parseFloat(value).toLocaleString('en-US', { style: 'currency', currency: 'EGP' })} بنجاح`);
    }
  };

  const handleWithdraw = async (amount) => {
    setSuccessMessage('');
    clearError();

    const result = await withdraw(amount);

    if (result !== null) {
      setSuccessMessage(`تم سحب ${amount.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })} بنجاح. رقم الكوبون: ${result.couponId}`);
      setWithdrawnCoupon({
        id: result.couponId,
        amount: amount,
        date: new Date().toLocaleDateString('en-US'),
        time: new Date().toLocaleTimeString('en-US')
      });
    }
  };

  const handlePremiumTransfer = async () => {
    setSuccessMessage('');
    clearError();

    if (!verified) {
      // Redirect to profile verification
      window.location.href = '/profile?tab=identity';
      return;
    }

    const result = await requestPremium();
    if (result) {
      setSuccessMessage('تم إرسال طلب الترقية للبريميوم بنجاح! سيتم مراجعته في أقرب وقت');
    }
  };

  const handleReallyPremiumUpgrade = async () => {
    setSuccessMessage('');
    clearError();

    if (!verified) {
      window.location.href = '/profile?tab=identity';
      return;
    }

    const result = await upgradeToReallyPremium();
    if (result) {
      setSuccessMessage('تم ترقية حسابك للبريميوم المتقدم بنجاح!');
    }
  };

  const downloadCoupon = () => {
    if (!withdrawnCoupon) return;

    const couponData = `
كوبون سحب - سمساري
==================
رقم الكوبون: ${withdrawnCoupon.id}
المبلغ: ${withdrawnCoupon.amount.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}
التاريخ: ${withdrawnCoupon.date}
الوقت: ${withdrawnCoupon.time}
==================
احتفظ بهذا الكوبون في مكان آمن
    `;

    const blob = new Blob([couponData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coupon_${withdrawnCoupon.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    if (messageType === 'success') {
      setSuccessMessage('');
    } else if (messageType === 'error') {
      clearError();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-1">إدارة الرصيد</h1>
                <p className="text-slate-600">نظام إدارة محفظتك المالية المتطور</p>
              </div>
            </div>
            <button
              onClick={getUserInfo}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">تحديث</span>
            </button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full translate-x-12 translate-y-12"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">إجمالي الرصيد</h2>
                    <p className="text-slate-500">آخر تحديث: منذ دقائق</p>
                  </div>
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {balanceVisible ? <Eye className="w-5 h-5 text-slate-600" /> : <EyeOff className="w-5 h-5 text-slate-600" />}
                </button>
              </div>

              <div className="mb-6">
                {loading && balance === null ? (
                  <div className="flex items-center gap-3 text-2xl text-slate-600">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    جاري التحميل...
                  </div>
                ) : (
                  <div className="text-5xl font-bold text-slate-800 mb-2">
                    {balanceVisible ? (
                      balance !== null ? balance.toLocaleString('en-US', { style: 'currency', currency: 'EGP' }) : 'غير محدد'
                    ) : '••••••••'}
                  </div>
                )}
                <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">+2.5% نمو هذا الشهر</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">حالة الحساب</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${premium ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 text-indigo-100'}`}>
                  {premium ? 'بريميوم' : 'حساب عادي'}
                </span>
                {verified && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400 text-emerald-900">
                    موثق ✓
                  </span>
                )}
              </div>
              {!premium && (
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-sm text-indigo-100 mb-2">ترقية إلى بريميوم للحصول على:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• حدود أعلى للمعاملات</li>
                    <li>• دعم فني مخصص</li>
                    <li>• رسوم أقل</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <DepositCard onDeposit={handleDeposit} loading={loading} />
          <WithdrawCard onWithdraw={handleWithdraw} loading={loading} balance={balance} />

          {/* Premium Request Card - Only show if not premium and verified */}
          {!premium && verified && (
            <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-xl p-8 text-white hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">كن بريميوم</h3>
                <p className="text-orange-100">انضم للعضوية المميزة</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    المزايا المتميزة
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      حدود معاملات أعلى
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      دعم فني على مدار الساعة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      رسوم أقل بنسبة 50%
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      تقارير مالية متقدمة
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handlePremiumTransfer}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${loading
                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                    : 'bg-white text-orange-600 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full"></div>
                      جاري الإرسال...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Crown className="w-5 h-5" />
                      طلب البريميوم
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Really Premium Upgrade Card - Only show if premium and verified */}
          {premium && verified && (
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-xl p-8 text-white hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">بريميوم متقدم حقاً</h3>
                <p className="text-pink-100">احصل على أقصى المزايا الممكنة</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    المزايا الحصرية
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      حدود معاملات غير محدودة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      دعم مخصص VIP
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      بدون رسوم معاملات
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      تحليلات متقدمة
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleReallyPremiumUpgrade}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${loading
                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                    : 'bg-white text-purple-600 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                      جاري الترقية...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Crown className="w-5 h-5" />
                      ترقية للمتقدم
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Verification Required Card - Only show if not verified */}
          {!verified && (
            <div className="bg-gradient-to-br from-slate-600 to-slate-800 rounded-3xl shadow-xl p-8 text-white hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">التحقق من الهوية</h3>
                <p className="text-slate-300">مطلوب للوصول للميزات المتقدمة</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    مزايا التحقق
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      إمكانية طلب البريميوم
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      حدود معاملات أعلى
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      مصداقية أكثر
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => window.location.href = '/profile?tab=identity'}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 bg-white text-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Shield className="w-5 h-5" />
                    التحقق من الهوية
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <MessageModal
          isOpen={showMessageModal}
          onClose={closeMessageModal}
          type={messageType}
          message={messageType === 'success' ? successMessage : error}
        />

        <CouponModal
          isOpen={!!withdrawnCoupon}
          coupon={withdrawnCoupon}
          onClose={() => setWithdrawnCoupon(null)}
          onDownload={downloadCoupon}
        />
      </div>
    </div>
  );
};

export default BalanceManagement;