import React, { useState } from 'react';
import { ArrowDownCircle, Shield } from 'lucide-react';

const WithdrawCard = ({ onWithdraw, loading, balance, verified }) => {
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const handleSubmit = () => {
        if (withdrawAmount && verified) {
            onWithdraw(parseFloat(withdrawAmount));
            setWithdrawAmount('');
        }
    };

    const setMaxAmount = () => {
        if (balance !== null && verified) {
            setWithdrawAmount(balance.toString());
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
                    <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <ArrowDownCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">سحب رصيد</h3>
                    <p className="text-slate-600">اسحب أموالك واحصل على كوبون</p>
                </div>

                <div className="space-y-6 opacity-30">
                    <div>
                        <label className="block text-slate-700 font-semibold mb-3">مبلغ السحب</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="0.00"
                                min="1"
                                step="0.01"
                                max={balance || undefined}
                                disabled={loading}
                                className="w-full p-4 pr-16 border-2 border-slate-200 rounded-2xl font-medium transition-all duration-300 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 disabled:opacity-50 text-right"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-semibold">جنيه</span>
                        </div>
                        {balance !== null && (
                            <div className="flex items-center justify-between mt-3 text-sm">
                                <span className="text-slate-600">الرصيد المتاح: {balance.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</span>
                                <button
                                    type="button"
                                    onClick={setMaxAmount}
                                    className="text-rose-600 hover:text-rose-700 font-semibold"
                                >
                                    الكل
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !withdrawAmount || (balance !== null && parseFloat(withdrawAmount) > balance)}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${loading || !withdrawAmount || (balance !== null && parseFloat(withdrawAmount) > balance)
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                جاري المعالجة...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-3">
                                <ArrowDownCircle className="w-5 h-5" />
                                تأكيد السحب
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
                <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ArrowDownCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">سحب رصيد</h3>
                <p className="text-slate-600">اسحب أموالك واحصل على كوبون</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-slate-700 font-semibold mb-3">مبلغ السحب</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.00"
                            min="1"
                            step="0.01"
                            max={balance || undefined}
                            disabled={loading}
                            className="w-full p-4 pr-16 border-2 border-slate-200 rounded-2xl font-medium transition-all duration-300 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 disabled:opacity-50 text-right"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-semibold">جنيه</span>
                    </div>
                    {balance !== null && (
                        <div className="flex items-center justify-between mt-3 text-sm">
                            <span className="text-slate-600">الرصيد المتاح: {balance.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}</span>
                            <button
                                type="button"
                                onClick={setMaxAmount}
                                className="text-rose-600 hover:text-rose-700 font-semibold"
                            >
                                الكل
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !withdrawAmount || (balance !== null && parseFloat(withdrawAmount) > balance)}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${loading || !withdrawAmount || (balance !== null && parseFloat(withdrawAmount) > balance)
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            جاري المعالجة...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-3">
                            <ArrowDownCircle className="w-5 h-5" />
                            تأكيد السحب
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default WithdrawCard;
