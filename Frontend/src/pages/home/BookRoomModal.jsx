import React, { useState, useMemo } from 'react';
import { X, Bed, Calendar, Clock, DollarSign } from 'lucide-react';

const BookRoomModal = ({
    isOpen,
    onClose,
    houseMainInfo,
    houseInspectionInfo,
    onBookingSubmit
}) => {
    const [selectedBeds, setSelectedBeds] = useState([]);
    const [bookingData, setBookingData] = useState({
        startDate: '',
        endDate: '',
        startArrivalDate: '',
        endArrivalDate: ''
    });

    // Calculate duration and estimated price
    const calculatedData = useMemo(() => {
        if (!bookingData.startDate || !bookingData.endDate) {
            return { duration: 0, estimatedPrice: 0 };
        }

        const startDate = new Date(bookingData.startDate);
        const endDate = new Date(bookingData.endDate);
        const diffTime = Math.abs(endDate - startDate);
        const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Base price per bed (you can adjust these values)
        const basePricePerBed = houseMainInfo.rentalType === 0 ? 100 : 2000; // Daily: 100, Monthly: 2000
        const estimatedPrice = duration * selectedBeds.length * basePricePerBed;

        return { duration, estimatedPrice };
    }, [bookingData.startDate, bookingData.endDate, selectedBeds.length, houseMainInfo.rentalType]);

    // Generate bed options based on numberOfBeds
    const bedOptions = Array.from({ length: houseInspectionInfo.numberOfBeds }, (_, i) => ({
        id: `bed${i + 1}`,
        label: `سرير ${i + 1}`
    }));

    const toggleBed = (bedId) => {
        setSelectedBeds(prev =>
            prev.includes(bedId)
                ? prev.filter(id => id !== bedId)
                : [...prev, bedId]
        );
    };

    const handleSubmit = () => {
        const finalBookingData = {
            startDate: new Date(bookingData.startDate).toISOString(),
            endDate: new Date(bookingData.endDate).toISOString(),
            rentalType: houseMainInfo.rentalType,
            houseId: houseInspectionInfo.houseId,
            startArrivalDate: new Date(bookingData.startArrivalDate).toISOString(),
            endArrivalDate: new Date(bookingData.endArrivalDate).toISOString(),
            rentalUnitIds: selectedBeds
        };

        onBookingSubmit(finalBookingData);
        onClose();
    };

    const resetForm = () => {
        setSelectedBeds([]);
        setBookingData({
            startDate: '',
            endDate: '',
            startArrivalDate: '',
            endArrivalDate: ''
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">احجز الآن</h2>
                            <p className="text-sm text-gray-600">اختر التواريخ والأسرة المناسبة لك</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Combined Date and Arrival Time Selection */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <h3 className="text-md font-semibold text-gray-900">تواريخ الإقامة وأوقات الوصول</h3>
                        </div>

                        {/* Stay Dates */}
                        <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        تاريخ بداية الإقامة
                                    </label>
                                    <input
                                        type="date"
                                        value={bookingData.startDate}
                                        onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        تاريخ نهاية الإقامة
                                    </label>
                                    <input
                                        type="date"
                                        value={bookingData.endDate}
                                        onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Arrival Times */}
                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">أوقات الوصول</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وقت الوصول من
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={bookingData.startArrivalDate}
                                        onChange={(e) => setBookingData(prev => ({ ...prev, startArrivalDate: e.target.value }))}
                                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وقت الوصول إلى
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={bookingData.endArrivalDate}
                                        onChange={(e) => setBookingData(prev => ({ ...prev, endArrivalDate: e.target.value }))}
                                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bed Selection */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Bed className="w-4 h-4 text-purple-600" />
                                <h3 className="text-md font-semibold text-gray-900">اختيار الأسرة</h3>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {selectedBeds.length} من {houseInspectionInfo.numberOfBeds} محدد
                            </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {bedOptions.map((bed) => (
                                <button
                                    key={bed.id}
                                    onClick={() => toggleBed(bed.id)}
                                    className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center hover:scale-105 ${selectedBeds.includes(bed.id)
                                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg'
                                        : 'border-gray-200 hover:border-purple-300 text-gray-600 hover:bg-purple-25'
                                        }`}
                                >
                                    <Bed className={`w-6 h-6 mb-2 ${selectedBeds.includes(bed.id) ? 'text-purple-500' : 'text-gray-400'
                                        }`} />
                                    <span className="text-xs font-medium">{bed.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <h3 className="text-md font-semibold text-gray-900">ملخص الحجز والتكلفة</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-blue-600">{selectedBeds.length}</div>
                                    <div className="text-xs text-gray-600">عدد الأسرة</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">
                                        {houseMainInfo.rentalType === 0 ? 'يومي' : 'شهري'}
                                    </div>
                                    <div className="text-xs text-gray-600">نوع الإيجار</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-orange-600">{calculatedData.duration}</div>
                                    <div className="text-xs text-gray-600">
                                        {houseMainInfo.rentalType === 0 ? 'يوم' : 'شهر'}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-purple-600">
                                        {calculatedData.estimatedPrice.toLocaleString()} ج.م
                                    </div>
                                    <div className="text-xs text-gray-600">التكلفة المقدرة</div>
                                </div>
                            </div>
                        </div>

                        {calculatedData.duration > 0 && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>السعر لكل سرير ({houseMainInfo.rentalType === 0 ? 'يومي' : 'شهري'}):</span>
                                        <span className="font-medium">{(houseMainInfo.rentalType === 0 ? 100 : 2000).toLocaleString()} ج.م</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>عدد الأسرة × المدة:</span>
                                        <span className="font-medium">{selectedBeds.length} × {calculatedData.duration}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between text-md font-bold text-purple-600">
                                        <span>المجموع:</span>
                                        <span>{calculatedData.estimatedPrice.toLocaleString()} ج.م</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 font-medium"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!bookingData.startDate || !bookingData.endDate || selectedBeds.length === 0}
                            className="flex-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            تأكيد الحجز 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookRoomModal;
