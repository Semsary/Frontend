import React, { useState } from 'react';
import { ArrowUpCircle, Shield } from 'lucide-react';

const DepositCard = ({ onDeposit, loading, verified }) => {
    const [couponCode, setCouponCode] = useState('');

    const handleSubmit = () => {
        if (couponCode && couponCode.trim().length > 0 && verified) {
            onDeposit(couponCode.trim());
            setCouponCode('');
        }
    };

    if (!verified) {
        return (
            <div className="bg-gray-100 rounded-3xl shadow-xl border border-slate-200/60 p-8 relative">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                    <div className="text-center">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-semibold">يتطلب التحقق من الهوية</p>
                    </div>
                </div>

                <div className="text-center mb-8 opacity-30">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <ArrowUpCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">إيداع رصيد</h3>
                    <p className="text-slate-600">أدخل رمز الكوبون لإضافة رصيد</p>
                </div>

                <div className="space-y-6 opacity-30">
                    <div>
                        <label className="block text-slate-700 font-semibold mb-3">رمز الكوبون</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="أدخل رمز الكوبون"
                                disabled={loading}
                                className="w-full p-4 border-2 border-slate-200 rounded-2xl font-medium transition-all duration-300 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 text-center text-lg tracking-wider"
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-2 text-center">
                            مثال: C1A2B3C4D5
                        </p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !couponCode || couponCode.trim().length === 0}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${loading || !couponCode || couponCode.trim().length === 0
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                جاري التحقق من الكوبون...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-3">
                                <ArrowUpCircle className="w-5 h-5" />
                                تأكيد الإيداع
                            </span>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ArrowUpCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">إيداع رصيد</h3>
                <p className="text-slate-600">أدخل رمز الكوبون لإضافة رصيد</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-slate-700 font-semibold mb-3">رمز الكوبون</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="أدخل رمز الكوبون"
                            disabled={loading}
                            className="w-full p-4 border-2 border-slate-200 rounded-2xl font-medium transition-all duration-300 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 text-center text-lg tracking-wider"
                        />
                    </div>
                    <p className="text-sm text-slate-500 mt-2 text-center">
                        مثال: C1A2B3C4D5
                    </p>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !couponCode || couponCode.trim().length === 0}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${loading || !couponCode || couponCode.trim().length === 0
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            جاري التحقق من الكوبون...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-3">
                            <ArrowUpCircle className="w-5 h-5" />
                            تأكيد الإيداع
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DepositCard;
