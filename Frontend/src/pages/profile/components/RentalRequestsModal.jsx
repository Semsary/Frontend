import React, { useState } from 'react';
import { X, User, Calendar, DollarSign, Home, Clock, Check, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import useHouseStore from '../../../store/house.store';

const RentalRequestsModal = ({ request, closeModal, onRequestUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
    const { acceptRentalRequest } = useHouseStore();

    const handleAction = async (action) => {
        const actionValue = action === 'approve' ? 1 : 2;
        const actionText = action === 'approve' ? 'موافقة' : 'رفض';

        const confirmMessage = `هل أنت متأكد من ${actionText} طلب الإيجار؟`;
        if (!window.confirm(confirmMessage)) return;

        setLoading(true);
        setActionType(action);

        try {
            // Simulate API call - replace with actual API
            console.log(`Processing ${actionText} for request ID: ${request.rentalId}`);
            const success = await acceptRentalRequest(request.rentalId, actionValue);
            if (success) {
                toast.success(`تم ${actionText} طلب الإيجار بنجاح`);
                onRequestUpdate((prevRequests) =>
                    prevRequests.filter(req => req.rentalId !== request.rentalId)
                );
                closeModal();
            } else {
                toast.error(`فشل في ${actionText} طلب الإيجار`);
            }
        } catch (error) {
            console.error('Error processing rental request:', error);
            toast.error(`حدث خطأ أثناء ${actionText} طلب الإيجار`);
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} يوم`;
        } else if (diffDays < 365) {
            const months = Math.round(diffDays / 30);
            return `${months} شهر`;
        } else {
            const years = Math.round(diffDays / 365);
            return `${years} سنة`;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">تفاصيل طلب الإيجار</h2>
                    <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Request Status Alert */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <span className="font-medium text-yellow-800">طلب قيد المراجعة</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                            يرجى مراجعة التفاصيل بعناية قبل اتخاذ قرار الموافقة أو الرفض
                        </p>
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            معلومات العميل
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-600">الاسم الأول:</span>
                                    <p className="font-semibold text-gray-900">{request.firstname}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">الاسم الأخير:</span>
                                    <p className="font-semibold text-gray-900">{request.lastname}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">رقم الطلب:</span>
                                    <p className="font-semibold text-gray-900">#{request.rentalId}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">معرف العقار:</span>
                                    <p className="font-semibold text-gray-900 text-xs">{request.houseId}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            المعلومات المالية
                        </h3>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-green-700">مبلغ الضمان:</span>
                                <span className="font-bold text-xl text-green-800">
                                    {request.warrantyMoney.toLocaleString()} جنيه
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rental Period */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            فترة الإيجار
                        </h3>
                        <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-purple-700">المدة الإجمالية:</span>
                                <span className="font-semibold text-purple-800">
                                    {calculateDuration(request.startDate, request.endDate)}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-purple-700">تاريخ البداية:</span>
                                    <p className="font-semibold text-purple-800">{formatDate(request.startDate)}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-purple-700">تاريخ النهاية:</span>
                                    <p className="font-semibold text-purple-800">{formatDate(request.endDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Arrival Time Preferences */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            أوقات الوصول المفضلة
                        </h3>
                        <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                            <div>
                                <span className="text-sm text-orange-700">بداية فترة الوصول:</span>
                                <p className="font-semibold text-orange-800">{formatDateTime(request.startArrivalDate)}</p>
                            </div>
                            <div>
                                <span className="text-sm text-orange-700">نهاية فترة الوصول:</span>
                                <p className="font-semibold text-orange-800">{formatDateTime(request.endArrivalDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={() => handleAction('approve')}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && actionType === 'approve' ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                        {loading && actionType === 'approve' ? 'جاري الموافقة...' : 'موافقة'}
                    </button>

                    <button
                        onClick={() => handleAction('reject')}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && actionType === 'reject' ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <XCircle className="w-4 h-4" />
                        )}
                        {loading && actionType === 'reject' ? 'جاري الرفض...' : 'رفض'}
                    </button>

                    <button
                        onClick={closeModal}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RentalRequestsModal;
