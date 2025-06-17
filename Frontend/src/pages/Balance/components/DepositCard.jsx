import React, { useState } from 'react';
import { ArrowUpCircle } from 'lucide-react';

const DepositCard = ({ onDeposit, loading }) => {
    const [depositAmount, setDepositAmount] = useState('');

    const handleSubmit = () => {
        if (depositAmount && parseFloat(depositAmount) > 0) {
            onDeposit(depositAmount);
            setDepositAmount('');
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ArrowUpCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">إيداع رصيد</h3>
                <p className="text-slate-600">أضف أموال إلى محفظتك</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-slate-700 font-semibold mb-3">مبلغ الإيداع</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="0.00"
                            min="1"
                            step="0.01"
                            disabled={loading}
                            className="w-full p-4 pr-16 border-2 border-slate-200 rounded-2xl font-medium transition-all duration-300 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 text-right"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-semibold">جنيه</span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !depositAmount || parseFloat(depositAmount) <= 0}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${loading || !depositAmount || parseFloat(depositAmount) <= 0
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            جاري المعالجة...
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
