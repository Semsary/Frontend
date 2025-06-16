import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useHouseStore from './../../store/house.store';
import MapDisplay from './../../components/MapDisplay';
import {
  MapPin,
  Star,
  Bed,
  Bath,
  Wind,
  Users,
  Table2,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2
} from 'lucide-react';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const { getHouseById } = useHouseStore();

  const [defaultHomeFeatures] = useState([
    {
      "id": 1,
      "name": "HaveNearHospital",
      "translation": "يوجد بالقرب مستشفى"
    },
    {
      "id": 2,
      "name": "HaveNearGym",
      "translation": "يوجد بالقرب صالة ألعاب رياضية"
    },
    {
      "id": 4,
      "name": "HaveNearPlayGround",
      "translation": "يوجد بالقرب ملعب"
    },
    {
      "id": 8,
      "name": "HaveNearSchool",
      "translation": "يوجد بالقرب مدرسة"
    },
    {
      "id": 16,
      "name": "HaveNearUniversity",
      "translation": "يوجد بالقرب جامعة"
    },
    {
      "id": 32,
      "name": "HaveNearSupermarket",
      "translation": "يوجد بالقرب سوبر ماركت"
    },
    {
      "id": 64,
      "name": "HaveNearRestaurant",
      "translation": "يوجد بالقرب مطعم"
    },
    {
      "id": 128,
      "name": "HaveNearBusStation",
      "translation": "يوجد بالقرب محطة حافلات"
    },
    {
      "id": 256,
      "name": "HaveNearBank",
      "translation": "يوجد بالقرب بنك"
    },
    {
      "id": 512,
      "name": "HaveWiFi",
      "translation": "يوجد واي فاي"
    },
    {
      "id": 1024,
      "name": "HaveTV",
      "translation": "يوجد تلفزيون"
    },
    {
      "id": 2048,
      "name": "HaveKitchen",
      "translation": "يوجد مطبخ"
    },
    {
      "id": 4096,
      "name": "HaveElevator",
      "translation": "يوجد مصعد"
    },
    {
      "id": 8192,
      "name": "HaveWashingMachine",
      "translation": "يوجد غسالة"
    },
    {
      "id": 16384,
      "name": "HaveCooker",
      "translation": "يوجد موقد/بوتاجاز"
    },
    {
      "id": 32768,
      "name": "HaveFridge",
      "translation": "يوجد ثلاجة"
    },
    {
      "id": 65536,
      "name": "HaveHeater",
      "translation": "يوجد سخان/دفايات"
    },
    {
      "id": 131072,
      "name": "HaveSalon",
      "translation": "يوجد صالون/غرفة معيشة"
    },
    {
      "id": 262144,
      "name": "DiningRoom",
      "translation": "غرفة طعام"
    }
  ]);

  useEffect(() => {
    // Fetch property data based on the ID
    const fetchPropertyData = async () => {
      const data = await getHouseById(id);
      setPropertyData(data);
    };

    fetchPropertyData();
  }, [id]);

  // Function to decode houseFeature integer into individual features
  const getActiveFeatures = (houseFeatureValue) => {
    if (!houseFeatureValue) return [];

    return defaultHomeFeatures.filter(feature => {
      return (houseFeatureValue & feature.id) === feature.id;
    });
  };

  if (!propertyData) {
    return (<div>Loading...</div>);
  }

  const { houseMainInfo, houseInspectionInfo, rentalUnitInfo } = propertyData;

  // Get active features from the houseFeature value
  const activeFeatures = getActiveFeatures(houseInspectionInfo.houseFeature);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === houseInspectionInfo.houseImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? houseInspectionInfo.houseImages.length - 1 : prev - 1
    );
  };

  const propertyFeatures = [
    { icon: Bed, label: 'غرف النوم', value: houseInspectionInfo.numberOfBedRooms },
    { icon: Bath, label: 'دورات المياه', value: houseInspectionInfo.numberOfPathRooms },
    { icon: Wind, label: 'مكيفات', value: houseInspectionInfo.numberOfAirConditionnar },
    { icon: Building, label: 'الطابق', value: houseInspectionInfo.floorNumber },
    { icon: Users, label: 'أسرة', value: houseInspectionInfo.numberOfBeds },
    { icon: Table2, label: 'طاولات', value: houseInspectionInfo.numberOfTables }
  ];

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

  const handleBookingClick = () => {
    navigate(`/booking/${id}`, {
      state: {
        houseMainInfo,
        houseInspectionInfo
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5 mr-2" />
              العودة للقائمة
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all duration-200 ${isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-gray-200">
                <img
                  src={houseInspectionInfo.houseImages[currentImageIndex]}
                  alt={houseMainInfo.houseName}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {houseInspectionInfo.houseImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {houseInspectionInfo.houseImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden transition-all duration-200 ${index === currentImageIndex
                      ? 'ring-2 ring-blue-600 ring-offset-2'
                      : 'hover:scale-105'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`صورة ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {houseMainInfo.houseName}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{houseMainInfo.city}, {houseMainInfo.street}</span>
                  </div>
                  {houseMainInfo.numOfRaters > 0 && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold text-gray-900 mr-1">
                        {houseMainInfo.houseAverageRate}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({houseMainInfo.numOfRaters} تقييم للشقة)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {propertyFeatures.map((feature, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-2xl">
                    <feature.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold text-gray-900">{feature.value}</div>
                    <div className="text-sm text-gray-500">{feature.label}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">الوصف</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {houseMainInfo.houseDescription}
                </p>
              </div>

              {/* House Features */}
              {activeFeatures.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">المميزات والخدمات</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-100"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-gray-700 text-sm font-medium">
                          {feature.translation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">تقييمات الشقة</h2>
              <div className="space-y-4">
                {/* Sample comments for apartment */}
                <div className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      أ
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-semibold text-gray-900 mr-2">أحمد محمد</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        شقة ممتازة ونظيفة، الموقع مناسب جداً والخدمات متوفرة. أنصح بها بشدة.
                      </p>
                      <span className="text-gray-400 text-xs">منذ أسبوعين</span>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      س
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-semibold text-gray-900 mr-2">سارة علي</span>
                        <div className="flex items-center">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        مكان هادئ ومريح، لكن قد تحتاج لبعض التحديثات البسيطة في الأثاث.
                      </p>
                      <span className="text-gray-400 text-xs">منذ شهر</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">الموقع</h2>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden">
                <MapDisplay
                  latitude={houseInspectionInfo.latitude}
                  longitude={houseInspectionInfo.longitude}
                  title={houseMainInfo.houseName}
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <span className="font-medium">الإحداثيات:</span> {houseInspectionInfo.latitude}, {houseInspectionInfo.longitude}
                </p>
                <p>
                  <span className="font-medium">العنوان:</span> {houseMainInfo.city}, {houseMainInfo.street}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {rentalUnitInfo[0]?.dailyCost?.toLocaleString()} جنيه
                </div>
                <div className="text-gray-500">لليلة الواحدة</div>
                {rentalUnitInfo[0]?.monthlyCost && (
                  <div className="text-lg text-gray-700 mt-2">
                    {rentalUnitInfo[0].monthlyCost.toLocaleString()} جنيه/شهريًا
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBookingClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200"
                >
                  احجز الآن
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 inline mr-1" />
                آخر تحديث للبيانات: {new Date(houseInspectionInfo.inspectionDate).toLocaleDateString('en-EG')}
              </div>
            </div>

            {/* Property Rating Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">تقييم الشقة</h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {houseMainInfo.houseAverageRate}
                </div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(houseMainInfo.houseAverageRate)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  من {houseMainInfo.numOfRaters} تقييم
                </div>
              </div>

              {/* Rating breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">النظافة</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-4/5 h-full bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">4.2</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الموقع</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-full h-full bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">4.5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">القيمة مقابل السعر</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-3/5 h-full bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">3.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات إضافية</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم العقار</span>
                  <span className="font-medium">{houseInspectionInfo.houseId.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نوع الإيجار</span>
                  <span className="font-medium">
                    {houseMainInfo.rentalType === 0 ? 'يومي' : 'شهري'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">عدد الشرفات</span>
                  <span className="font-medium">{houseInspectionInfo.numberOfBalacons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">عدد الكراسي</span>
                  <span className="font-medium">{houseInspectionInfo.numberOfChairs}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;