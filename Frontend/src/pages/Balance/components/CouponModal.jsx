import React from 'react';
import { Download, X } from 'lucide-react';

const CouponModal = ({ coupon, isOpen, onClose, onDownload }) => {
    if (!isOpen || !coupon) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 left-6 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <X className="w-6 h-6 text-slate-500" />
                </button>

                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Download className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-3xl font-bold text-slate-800 mb-2">كوبون السحب جاهز</h3>
                    <p className="text-slate-600 mb-8">تم إنشاء كوبون السحب بنجاح ويمكنك تحميله الآن</p>

                    <div className="bg-slate-50 rounded-3xl p-6 mb-8 border-2 border-dashed border-slate-300">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white rounded-2xl">
                                <span className="text-slate-600 font-medium">رقم الكوبون:</span>
                                <span className="font-bold text-slate-800 text-lg">{coupon.id}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-2xl">
                                <span className="text-slate-600 font-medium">المبلغ:</span>
                                <span className="font-bold text-emerald-600 text-lg">
                                    {coupon.amount.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-2xl">
                                <span className="text-slate-600 font-medium">التاريخ والوقت:</span>
                                <span className="font-medium text-slate-700">{coupon.date} - {coupon.time}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={onDownload}
                            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <Download className="w-5 h-5" />
                            تحميل الكوبون
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-4 px-6 bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-300 transition-all duration-300"
                        >
                            إغلاق
                        </button>
                    </div>

                    <p className="text-sm text-slate-500 mt-6">
                        احتفظ بهذا الكوبون في مكان آمن واستخدمه لاحقاً للإيداع في أي وقت
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CouponModal;
