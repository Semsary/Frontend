import React, { useEffect, useState } from 'react';
import { X, MapPin, Home, Bed, Wind, Bath, Calendar, User, DollarSign, Image, Star } from 'lucide-react';
import useHouseStore from '../../../store/house.store';
import { toast } from 'sonner';

const ViewHouseDataModal = ({ closeModal, houseId, fetchHouses }) => {
    const { getHouseInspectionData, acceptHouseInspection } = useHouseStore();
    const [houseData, setHouseData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAcceptInspection = async () => {
        const confirmAccept = window.confirm("هل أنت متأكد من قبول المعاينة؟");
        if (!confirmAccept) return;
        
        setLoading(true);
        try {
            const response = await acceptHouseInspection(houseId);
            if (response) {
                toast.success('تم قبول المعاينة بنجاح');
                closeModal();
                fetchHouses();
            } else {
                console.error('Failed to accept inspection');
                toast.error('فشل في قبول المعاينة');
            }
        } catch (error) {
            console.error('Error accepting inspection:', error);
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        console.log('Fetching house data for ID:', houseId);
        const fetchHouseData = async () => {
            try {
                setLoading(true);
                const data = await getHouseInspectionData(houseId);
                console.log('Fetched house data:', data);
                setHouseData(data);
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



    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="mr-3 text-gray-600">جاري التحميل...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!houseData && !loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">تفاصيل العقار</h2>
                    <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* House Images */}
                    {houseData.houseImages && houseData.houseImages.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Image className="w-5 h-5 text-blue-600" />
                                صور العقار
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {houseData.houseImages.map((image, index) => (
                                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={image}
                                            alt={`صورة العقار ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Home className="w-5 h-5 text-blue-600" />
                            المعلومات الأساسية
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Home className="w-4 h-4" />
                                    <span className="text-sm">رقم الطابق</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.floorNumber}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Bed className="w-4 h-4" />
                                    <span className="text-sm">عدد غرف النوم</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.numberOfBedRooms}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Bath className="w-4 h-4" />
                                    <span className="text-sm">عدد دورات المياه</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.numberOfPathRooms}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Wind className="w-4 h-4" />
                                    <span className="text-sm">عدد المكيفات</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.numberOfAirConditionnar}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Home className="w-4 h-4" />
                                    <span className="text-sm">عدد الشرفات</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.numberOfBalacons}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm">السعر</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {houseData.price > 0 ? `${houseData.price} جنيه` : 'غير محدد'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Furniture Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Home className="w-5 h-5 text-blue-600" />
                            تفاصيل الأثاث
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Bed className="w-4 h-4" />
                                    <span className="text-sm">عدد الأسرّة</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.numberOfBeds}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Home className="w-4 h-4" />
                                    <span className="text-sm">عدد الطاولات</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.numberOfTables}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Home className="w-4 h-4" />
                                    <span className="text-sm">عدد الكراسي</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.numberOfChairs}</p>
                            </div>
                        </div>
                    </div>

                    {/* House Feature */}
              

                    {/* Location */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            الموقع
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">خط الطول</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.longitude}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">خط العرض</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.latitude}</p>
                            </div>
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
                                    {new Date(houseData.inspectionRequestDate).toLocaleDateString('ar-EG')}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">تاريخ المعاينة</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(houseData.inspectionDate).toLocaleDateString('ar-EG')}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">المعاين</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{houseData.inspectorId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleAcceptInspection}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200"
                        disabled={loading}
                    >
                        {loading ? 'جاري قبول المعاينة...' : 'قبول المعاينة'}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                        هذة البيانات قم تم اضافتها من قبل خدمة العملاء في حال الموافقة عليها ستظهر في صفحة العقارات الخاصة بك.
                    </p>
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

export default ViewHouseDataModal;
