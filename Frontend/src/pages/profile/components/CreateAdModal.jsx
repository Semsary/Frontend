import React, { useEffect, useState } from 'react';
import { X, MapPin, Home, Bed, Wind, Bath, Calendar, User, DollarSign, Image, Star, Save } from 'lucide-react';
import useHouseStore from '../../../store/house.store';
import { toast } from 'sonner';

const CreateAdModal = ({ closeModal, houseId, houseData, mode = "rental" }) => {
    const { getHouseInspectionData, acceptHouseInspection } = useHouseStore();
    const [inspectionData, setInspectionData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Rental form state
    const [rentalForm, setRentalForm] = useState({
        houseId: houseData?.lastApprovedInspection
            ?.houseId || houseId || "",
        rentalType: 0, // 0 = daily, 1 = monthly
        houseName: "",
        houseDescription: "",
        monthlyCost: 0,
        dailyCost: 0
    });



    const handleSubmitRental = async () => {
        if (!rentalForm.houseName.trim() || !rentalForm.houseDescription.trim()) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        if (rentalForm.rentalType === 0 && rentalForm.dailyCost <= 0) {
            toast.error('يرجى إدخال التكلفة اليومية');
            return;
        }

        if (rentalForm.rentalType === 1 && rentalForm.monthlyCost <= 0) {
            toast.error('يرجى إدخال التكلفة الشهرية');
            return;
        }

        setLoading(true);
        try {
            // Here you would make the API call to submit rental data
            console.log('Submitting rental data:', rentalForm);
            console.log('Submitting rental data:', houseId);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('تم إرسال بيانات التأجير بنجاح');
            closeModal();
        } catch (error) {
            console.error('Error submitting rental:', error);
            toast.error('فشل في إرسال بيانات التأجير');
        } finally {
            setLoading(false);
        }
    };

    const handleRentalFormChange = (field, value) => {
        setRentalForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    useEffect(() => {
        console.log('Fetching house data for ID:', houseId);
        const fetchHouseData = async () => {
            try {
                // setLoading(true);
                const data = await getHouseInspectionData(houseId);
                console.log('Fetched house data:', data);
                setInspectionData(data);
            } catch (error) {
                console.error('Error fetching house data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (houseId) {
            fetchHouseData();
        }
    }, [houseId, getHouseInspectionData]);

 
    // Use houseData if provided (for rental mode) or fetch inspection data
    const displayData = houseData?.lastApprovedInspection || inspectionData;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="mr-3 text-gray-600">جاري التحميل...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!displayData) {
        return (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="text-center text-red-600">
                        حدث خطأ في تحميل البيانات
                    </div>
                    <button
                        onClick={closeModal}
                        className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        إضافة عقار للتأجير
                    </h2>
                    <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Rental Form */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Save className="w-5 h-5 text-blue-600" />
                            معلومات التأجير
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم العقار *
                                </label>
                                <input
                                    type="text"
                                    value={rentalForm.houseName}
                                    onChange={(e) => handleRentalFormChange('houseName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="أدخل اسم العقار"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    نوع التأجير *
                                </label>
                                <select
                                    value={rentalForm.rentalType}
                                    onChange={(e) => handleRentalFormChange('rentalType', parseInt(e.target.value))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={0}>الشقة كاملة</option>
                                    <option value={1}>بالسرير</option>
                                </select>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    التكلفة اليومية (جنيه) *
                                </label>
                                <input
                                    type="number"
                                    value={rentalForm.dailyCost}
                                    onChange={(e) => handleRentalFormChange('dailyCost', parseInt(e.target.value) || 0)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="أدخل التكلفة اليومية"
                                    min="0"
                                />
                            </div>



                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    التكلفة الشهرية (جنيه) *
                                </label>
                                <input
                                    type="number"
                                    value={rentalForm.monthlyCost}
                                    onChange={(e) => handleRentalFormChange('monthlyCost', parseInt(e.target.value) || 0)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="أدخل التكلفة الشهرية"
                                    min="0"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                وصف العقار *
                            </label>
                            <textarea
                                value={rentalForm.houseDescription}
                                onChange={(e) => handleRentalFormChange('houseDescription', e.target.value)}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="أدخل وصف مفصل للعقار..."
                            />
                        </div>
                    </div>


                    {/* Inspection Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            تفاصيل المعاينة
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">تاريخ طلب المعاينة</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(displayData.inspectionRequestDate).toLocaleDateString('ar-EG')}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">تاريخ المعاينة</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(displayData.inspectionDate).toLocaleDateString('ar-EG')}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">المعاين</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{displayData.inspectorId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleSubmitRental}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200"
                        disabled={loading}
                    >
                        {loading ? 'جاري الإرسال...' : 'إرسال بيانات التأجير'}
                    </button>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={closeModal}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAdModal;
