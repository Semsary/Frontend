import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const MessageModal = ({
    isOpen,
    onClose,
    type, // 'success' or 'error'
    message
}) => {
    if (!isOpen || !message) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${type === 'success'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 left-6 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <X className="w-6 h-6 text-slate-500" />
                </button>

                <div className="p-8 text-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg ${type === 'success'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-red-500 to-rose-500'
                        }`}>
                        {type === 'success' ? (
                            <CheckCircle className="w-10 h-10 text-white" />
                        ) : (
                            <AlertCircle className="w-10 h-10 text-white" />
                        )}
                    </div>

                    <h3 className={`text-3xl font-bold mb-2 ${type === 'success' ? 'text-emerald-800' : 'text-red-800'
                        }`}>
                        {type === 'success' ? 'تمت العملية بنجاح' : 'حدث خطأ'}
                    </h3>

                    <div className={`rounded-3xl p-6 mb-8 border-2 border-dashed ${type === 'success'
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-red-50 border-red-300'
                        }`}>
                        <p className={`text-lg font-medium ${type === 'success' ? 'text-emerald-800' : 'text-red-800'
                            }`}>
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${type === 'success'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                                : 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                            }`}
                    >
                        تم
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
