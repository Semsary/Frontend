import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Bed, Calendar, Clock, DollarSign, MapPin, Star, Check, ChevronLeft, ChevronRight, AlertCircle, Loader, AlertTriangle } from 'lucide-react';
import useHouseStore from '../../store/house.store';
import { toast } from 'sonner';
import BookingSuccess from './BookingSuccess';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { advertisementId, houseMainInfo, houseInspectionInfo } = location.state || {};
  const { checkAvailabilityOfBedroom, bookRentalUnit, loading } = useHouseStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBeds, setSelectedBeds] = useState([]);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null); // New state for booking success
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startArrivalDate: '',
    endArrivalDate: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Calculate duration and estimated price
  const calculatedData = useMemo(() => {
    if (!bookingData.startDate || !bookingData.endDate) {
      return { duration: 0, estimatedPrice: 0 };
    }

    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const diffTime = Math.abs(endDate - startDate);
    const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Base price per bed
    const basePricePerBed = houseMainInfo.rentalType === 0 ? 100 : 2000;
    const estimatedPrice = duration * selectedBeds.length * basePricePerBed;

    return { duration, estimatedPrice };
  }, [bookingData.startDate, bookingData.endDate, selectedBeds.length, houseMainInfo?.rentalType]);

  // Generate bed options based on availability results
  const bedOptions = useMemo(() => {
    if (!availabilityData) {
      // Default bed options when no availability check is done
      return Array.from({ length: houseInspectionInfo?.numberOfBeds || 0 }, (_, i) => ({
        id: `bed${i + 1}`,
        label: `سرير ${i + 1}`,
        available: true,
        rentalUnitId: null
      }));
    }

    // Map availability results to bed options
    return availabilityData.availableBeds.map((bed, index) => ({
      id: bed.rentalUnitId,
      label: `سرير ${index + 1}`,
      available: !bed.hasConflict,
      rentalUnitId: bed.rentalUnitId,
      hasConflict: bed.hasConflict
    }));
  }, [availabilityData, houseInspectionInfo?.numberOfBeds]);

  const toggleBed = (bedId) => {
    const bed = bedOptions.find(b => b.id === bedId);
    if (!bed || !bed.available) return; // Don't allow selection of unavailable beds

    setSelectedBeds(prev =>
      prev.includes(bedId)
        ? prev.filter(id => id !== bedId)
        : [...prev, bedId]
    );
  };

  // Date validation function
  const validateDates = () => {
    const errors = {};
    const now = new Date();
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const startArrivalDate = new Date(bookingData.startArrivalDate);
    const endArrivalDate = new Date(bookingData.endArrivalDate);

    // Check if all dates are provided
    if (!bookingData.startDate) errors.startDate = 'تاريخ بداية الإقامة مطلوب';
    if (!bookingData.endDate) errors.endDate = 'تاريخ نهاية الإقامة مطلوب';
    if (!bookingData.startArrivalDate) errors.startArrivalDate = 'وقت الوصول من مطلوب';
    if (!bookingData.endArrivalDate) errors.endArrivalDate = 'وقت الوصول إلى مطلوب';

    // Date logic validations
    if (bookingData.startDate && bookingData.endDate) {
      if (startDate >= endDate) {
        errors.endDate = 'تاريخ نهاية الإقامة يجب أن يكون بعد تاريخ البداية';
      }
    }

    if (bookingData.startDate && startDate < now.setHours(0, 0, 0, 0)) {
      errors.startDate = 'تاريخ بداية الإقامة يجب أن يكون في المستقبل';
    }

    if (bookingData.startArrivalDate && bookingData.endArrivalDate) {
      if (startArrivalDate >= endArrivalDate) {
        errors.endArrivalDate = 'وقت الوصول إلى يجب أن يكون بعد وقت الوصول من';
      }
    }

    if (bookingData.endArrivalDate && bookingData.endDate) {
      if (endArrivalDate > endDate) {
        errors.endArrivalDate = 'وقت الوصول يجب أن يكون قبل تاريخ نهاية الإقامة';
      }
    }

    if (bookingData.startArrivalDate && bookingData.startDate) {
      const startDateOnly = new Date(bookingData.startDate);
      if (startArrivalDate < startDateOnly) {
        errors.startArrivalDate = 'وقت الوصول يجب أن يكون في تاريخ بداية الإقامة أو بعده';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateDates()) {
        toast.error('يرجى تصحيح الأخطاء في التواريخ');
        return;
      }

      setCheckingAvailability(true);
      console.log("houseMainInfo", houseMainInfo)
      console.log("advertisementId -- ", advertisementId)
      try {
        const result = await checkAvailabilityOfBedroom(
          new Date(bookingData.startDate).toISOString(),
          new Date(bookingData.endDate).toISOString(),
          new Date(bookingData.startArrivalDate).toISOString(),
          new Date(bookingData.endArrivalDate).toISOString(),
          advertisementId,
        );

        if (result) {
          setAvailabilityData(result);
          setCurrentStep(2);
          // Clear previously selected beds since availability might have changed
          setSelectedBeds([]);
        }
      } catch (error) {
        console.error('Error checking availability:', error);
      } finally {
        setCheckingAvailability(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const isStep1Valid = () => {
    return bookingData.startDate &&
      bookingData.endDate &&
      bookingData.startArrivalDate &&
      bookingData.endArrivalDate &&
      Object.keys(validationErrors).length === 0;
  };

  const isStep2Valid = () => {
    return selectedBeds.length > 0;
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateDates()) {
      toast.error('يرجى تصحيح الأخطاء في التواريخ');
      return;
    }

    if (!isStep2Valid()) {
      toast.error('يرجى اختيار سرير واحد على الأقل');
      return;
    }

    try {
      const result = await bookRentalUnit(
        new Date(bookingData.startDate).toISOString(),
        new Date(bookingData.endDate).toISOString(),
        houseMainInfo.rentalType,
        houseInspectionInfo.houseId,
        new Date(bookingData.startArrivalDate).toISOString(),
        new Date(bookingData.endArrivalDate).toISOString(),
        selectedBeds // These are the actual rentalUnitIds from the API
      );

      if (result) {
        console.log('Booking successful:', result);
        setBookingSuccess(result);
        toast.success('تم الحجز بنجاح!');
      } else {

        toast(
          <div className="flex items-start gap-3 text-right">
            <AlertTriangle className="text-red-500 mt-1" size={20} />
            <div>
              <p className="text-sm font-semibold text-red-600">حدث خطأ أثناء الحجز</p>
              <p className="text-sm text-gray-700">
                الرجاء المحاولة مرة أخرى. تأكد من توثيق الهوية الخاصة بك.
              </p>
            </div>
          </div>,
          {
            duration: 5000,
            className:
              "bg-red-50 border border-red-200 p-4 rounded-lg shadow-md rtl text-sm",
          }
        );
      }
    } catch (error) {
      console.error('Error booking rental unit:', error);
      toast.error('حدث خطأ أثناء الحجز. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!houseMainInfo || !houseInspectionInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ في تحميل البيانات</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // Get active features from the houseFeature value

  // If booking is successful, show success screen
  if (bookingSuccess) {
    return (
      <BookingSuccess
        bookingSuccess={bookingSuccess}
        calculatedData={calculatedData}
        selectedBeds={selectedBeds}
        houseMainInfo={houseMainInfo}
        bookingData={bookingData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              العودة
            </button>
            <h1 className="text-2xl font-bold text-gray-900">حجز العقار</h1>
            <div></div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="flex items-center">
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                  {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <div className="mr-3 text-sm">
                  <div className={`font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                    اختيار التواريخ
                  </div>
                  <div className="text-gray-400 text-xs">التواريخ وأوقات الوصول</div>
                </div>
              </div>

              <div className={`flex-1 h-1 mx-4 rounded ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>

              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                  2
                </div>
                <div className="mr-3 text-sm">
                  <div className={`font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                    اختيار الأسرة
                  </div>
                  <div className="text-gray-400 text-xs">تحديد الأسرة المطلوبة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            {/* Step 1: Date Selection */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">اختر تواريخ إقامتك</h2>
                  <p className="text-gray-600 text-sm">حدد تواريخ بداية ونهاية الإقامة مع أوقات الوصول</p>
                </div>

                {/* Stay Dates */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 text-blue-600 ml-2" />
                    فترة الإقامة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ بداية الإقامة
                      </label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => {
                          setBookingData(prev => ({ ...prev, startDate: e.target.value }));
                          if (validationErrors.startDate) {
                            setValidationErrors(prev => ({ ...prev, startDate: '' }));
                          }
                        }}
                        className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${validationErrors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                      />
                      {validationErrors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.startDate}</p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ نهاية الإقامة
                      </label>
                      <input
                        type="date"
                        value={bookingData.endDate}
                        onChange={(e) => {
                          setBookingData(prev => ({ ...prev, endDate: e.target.value }));
                          if (validationErrors.endDate) {
                            setValidationErrors(prev => ({ ...prev, endDate: '' }));
                          }
                        }}
                        className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${validationErrors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                      />
                      {validationErrors.endDate && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.endDate}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrival Times */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-4 h-4 text-blue-600 ml-2" />
                    أوقات الوصول المتوقعة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وقت الوصول من
                      </label>
                      <input
                        type="datetime-local"
                        value={bookingData.startArrivalDate}
                        onChange={(e) => {
                          setBookingData(prev => ({ ...prev, startArrivalDate: e.target.value }));
                          if (validationErrors.startArrivalDate) {
                            setValidationErrors(prev => ({ ...prev, startArrivalDate: '' }));
                          }
                        }}
                        className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${validationErrors.startArrivalDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                      />
                      {validationErrors.startArrivalDate && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.startArrivalDate}</p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وقت الوصول إلى
                      </label>
                      <input
                        type="datetime-local"
                        value={bookingData.endArrivalDate}
                        onChange={(e) => {
                          setBookingData(prev => ({ ...prev, endArrivalDate: e.target.value }));
                          if (validationErrors.endArrivalDate) {
                            setValidationErrors(prev => ({ ...prev, endArrivalDate: '' }));
                          }
                        }}
                        className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${validationErrors.endArrivalDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                      />
                      {validationErrors.endArrivalDate && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.endArrivalDate}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 1 Navigation */}
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleBack}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isStep1Valid() || checkingAvailability}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center"
                  >
                    {checkingAvailability ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        جاري التحقق...
                      </>
                    ) : (
                      <>
                        التالي
                        <ChevronLeft className="w-4 h-4 mr-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Bed Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bed className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر الأسرة المطلوبة</h2>
                    <p className="text-gray-600">
                      حدد الأسرة التي تريد حجزها من إجمالي {bedOptions.filter(bed => bed.available).length} سرير متاح
                    </p>
                  </div>

                  {/* Availability Status */}
                  {availabilityData && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">{availabilityData.message}</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">
                        عدد الأسرة المتاحة: {bedOptions.filter(bed => bed.available).length} من {bedOptions.length}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">الأسرة المتاحة</h3>
                    </div>
                    <span className="text-sm text-gray-500 bg-blue-100 px-4 py-2 rounded-full font-medium">
                      {selectedBeds.length} من {bedOptions.filter(bed => bed.available).length} محدد
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {bedOptions.map((bed, index) => (
                      <button
                        key={bed.id}
                        onClick={() => toggleBed(bed.id)}
                        disabled={!bed.available}
                        className={`p-6 rounded-2xl border-3 transition-all duration-300 flex flex-col items-center hover:scale-105 transform relative ${selectedBeds.includes(bed.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xl ring-4 ring-blue-100'
                          : bed.available
                            ? 'border-gray-200 hover:border-blue-300 text-gray-600 hover:bg-blue-25 hover:shadow-lg'
                            : 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60'
                          }`}
                      >
                        <Bed className={`w-8 h-8 mb-3 ${selectedBeds.includes(bed.id)
                          ? 'text-blue-500'
                          : bed.available
                            ? 'text-gray-400'
                            : 'text-red-400'
                          }`} />
                        <span className="text-sm font-medium">{bed.label}</span>

                        {selectedBeds.includes(bed.id) && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-2">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}

                        {!bed.available && (
                          <div className="absolute top-2 right-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          </div>
                        )}

                        {!bed.available && (
                          <span className="text-xs text-red-500 mt-1">غير متاح</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* No available beds message */}
                  {bedOptions.filter(bed => bed.available).length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد أسرة متاحة</h3>
                      <p className="text-gray-600 mb-4">جميع الأسرة محجوزة في التواريخ المحددة</p>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        تغيير التواريخ
                      </button>
                    </div>
                  )}

                  {/* Step 2 Navigation */}
                  {bedOptions.filter(bed => bed.available).length > 0 && (
                    <div className="flex justify-between pt-6 border-t border-gray-100">
                      <button
                        onClick={handlePrevious}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center"
                      >
                        <ChevronRight className="w-4 h-4 ml-2" />
                        السابق
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!isStep2Valid() || loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            جاري الحجز...
                          </>
                        ) : (
                          <>
                            تأكيد الحجز - {calculatedData.estimatedPrice.toLocaleString()} ج.م
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Booking Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">ملخص الحجز والتكلفة</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedBeds.length}</div>
                        <div className="text-sm text-gray-600">عدد الأسرة</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {houseMainInfo.rentalType === 0 ? 'يومي' : 'يومي'}
                        </div>
                        <div className="text-sm text-gray-600">نوع الإيجار</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{calculatedData.duration}</div>
                        <div className="text-sm text-gray-600">
                          {houseMainInfo.rentalType === 0 ? 'يوم' : 'يوم'}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {calculatedData.estimatedPrice.toLocaleString()} ج.م
                        </div>
                        <div className="text-sm text-gray-600">التكلفة المقدرة</div>
                      </div>
                    </div>
                  </div>

                  {calculatedData.duration > 0 && (
                    <div className="bg-white rounded-xl p-4 border border-blue-200">
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span>السعر لكل سرير ({houseMainInfo.rentalType === 0 ? 'يومي' : 'يومي'}):</span>
                          <span className="font-medium">{(houseMainInfo.rentalType === 0 ? 100 : 2000).toLocaleString()} ج.م</span>
                        </div>
                        <div className="flex justify-between">
                          <span>عدد الأسرة × المدة:</span>
                          <span className="font-medium">{selectedBeds.length} × {calculatedData.duration}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between text-lg font-bold text-blue-600">
                          <span>المجموع:</span>
                          <span>{calculatedData.estimatedPrice.toLocaleString()} ج.م</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Property Info Sidebar */}
          <div className="space-y-6">
            {/* Property Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-8 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">{houseMainInfo.houseName}</h3>

              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 ml-2" />
                <span className="text-sm">{houseMainInfo.city}, {houseMainInfo.street}</span>
              </div>

              {houseMainInfo.numOfRaters > 0 && (
                <div className="flex items-center mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current ml-1" />
                  <span className="font-semibold text-gray-900 ml-1 text-sm">
                    {houseMainInfo.houseAverageRate}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({houseMainInfo.numOfRaters} تقييم)
                  </span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-900 mb-4 text-base">تفاصيل العقار</h4>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">غرف النوم</span>
                    <div className="font-medium">{houseInspectionInfo.numberOfBedRooms}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">دورات المياه</span>
                    <div className="font-medium">{houseInspectionInfo.numberOfPathRooms}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">الطابق</span>
                    <div className="font-medium">{houseInspectionInfo.floorNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">إجمالي الأسرة</span>
                    <div className="font-medium">{houseInspectionInfo.numberOfBeds}</div>
                  </div>
                </div>

                {/* Property Features */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;