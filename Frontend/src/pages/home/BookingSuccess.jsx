import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Wallet, Info, AlertCircle, MapPin, Star } from 'lucide-react';

const BookingSuccess = ({
    bookingSuccess,
    calculatedData,
    selectedBeds,
    houseMainInfo,
    bookingData
}) => {
    const navigate = useNavigate();

    // scroll to top on component mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50" dir="rtl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">تم الحجز بنجاح!</h1>
                    <p className="text-gray-600 text-lg">تهانينا! تم تأكيد حجزك وإنشاء معرف الإيجار</p>
                </div>

                {/* Booking Details Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Rental Information */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <CreditCard className="w-6 h-6 text-blue-600 ml-2" />
                                تفاصيل الحجز
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                    <div className="text-center">
                                        <div className="text-sm text-blue-600 mb-1">معرف الإيجار</div>
                                        <div className="text-2xl font-bold text-blue-700">#{bookingSuccess.rentalId}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-sm text-gray-600">عدد الأسرة</div>
                                        <div className="text-lg font-bold text-gray-900">{selectedBeds.length}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-sm text-gray-600">المدة</div>
                                        <div className="text-lg font-bold text-gray-900">
                                            {calculatedData.duration} {houseMainInfo.rentalType === 0 ? 'يوم' : 'يوم'}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <div className="text-center">
                                        <div className="text-sm text-green-600 mb-1">إجمالي التكلفة</div>
                                        <div className="text-xl font-bold text-green-700">
                                            {calculatedData.estimatedPrice.toLocaleString()} ج.م
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Warranty Money Information */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Wallet className="w-6 h-6 text-orange-600 ml-2" />
                                مبلغ الضمان المطلوب
                            </h2>

                            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 mb-6">
                                <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-orange-700 mb-2">
                                        {bookingSuccess.warrantyMoney.toLocaleString()} ج.م
                                    </div>
                                    <div className="text-sm text-orange-600">مبلغ الضمان المطلوب</div>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div className="text-sm text-gray-700">
                                            <p className="font-medium mb-2">معلومات مهمة:</p>
                                            <ul className="space-y-1 text-gray-600">
                                                <li>• يجب أن يكون لديك هذا المبلغ في رصيد حسابك</li>
                                                <li>• سيتم حجز المبلغ كضمان للحجز</li>
                                                <li>• سيتم إرجاع المبلغ عند انتهاء فترة الإيجار</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Balance Check */}
                            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div className="text-sm">
                                        <div className="font-medium text-yellow-800 mb-1">تأكد من رصيد حسابك</div>
                                        <div className="text-yellow-700">
                                            تأكد من وجود مبلغ {bookingSuccess.warrantyMoney.toLocaleString()} ج.م في رصيد حسابك لإتمام عملية الحجز
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Summary */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص العقار المحجوز</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{houseMainInfo.houseName}</h4>
                            <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 ml-2" />
                                <span className="text-sm">{houseMainInfo.city}, {houseMainInfo.street}</span>
                            </div>
                            {houseMainInfo.numOfRaters > 0 && (
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current ml-1" />
                                    <span className="font-semibold text-gray-900 ml-1 text-sm">
                                        {houseMainInfo.houseAverageRate}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        ({houseMainInfo.numOfRaters} تقييم)
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="text-sm text-gray-600">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-gray-500">تاريخ البداية:</span>
                                    <div className="font-medium">{new Date(bookingData.startDate).toLocaleDateString('ar-EG')}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500">تاريخ النهاية:</span>
                                    <div className="font-medium">{new Date(bookingData.endDate).toLocaleDateString('ar-EG')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/profile/bookings')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                        <CreditCard className="w-5 h-5 ml-2" />
                        عرض حجوزاتي
                    </button>
                    <button
                        onClick={() => navigate('/wallet')}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                        <Wallet className="w-5 h-5 ml-2" />
                        إدارة المحفظة
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center"
                    >
                        العودة للرئيسية
                    </button>
                </div>

                {/* Additional Information */}
                <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                        <Info className="w-5 h-5 ml-2" />
                        خطوات مهمة بعد الحجز
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <span className="text-blue-600 font-bold">1</span>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">تأكد من رصيد حسابك</h4>
                            <p className="text-gray-600">تحقق من وجود مبلغ الضمان في محفظتك</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <span className="text-blue-600 font-bold">2</span>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">تواصل مع المالك</h4>
                            <p className="text-gray-600">راجع تفاصيل الوصول مع مالك العقار</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <span className="text-blue-600 font-bold">3</span>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">احتفظ برقم الحجز</h4>
                            <p className="text-gray-600">ستحتاج رقم الحجز #{bookingSuccess.rentalId} للمراجعة</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
