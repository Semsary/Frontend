import React, { useEffect } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import useHomesStore from "../../store/house.store";
import { Link } from "react-router-dom";

const HomesGrid = ({ homes }) => {
  // Mock data for demonstration since we don't have the store
  const { filteredAdvertisements, loading, error } = useHomesStore();

  useEffect(() => {
    console.log("Filtered Advertisements:", filteredAdvertisements);
  }, [filteredAdvertisements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">حدث خطأ في تحميل البيانات</p>
          <p className="text-sm text-gray-500 mt-1">يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          العقارات المتاحة
        </h2>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          اكتشف مجموعة واسعة من العقارات المميزة التي تناسب احتياجاتك
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:px-20 md:px-10 px-4">
        {filteredAdvertisements?.map((home) => (
          <div
            key={home.advertisementId}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-blue-200 hover:-translate-y-1 flex flex-col backdrop-blur-sm hover:bg-white/95"
          >
            {/* Compact Image Section */}
            <div className="relative overflow-hidden">
              <div className="aspect-[5/3] overflow-hidden">
                <img
                  src={home.images?.[0] || "https://s3da-design.com/wp-content/uploads/2022/01/Home-Renovation-3-1024x683.jpg"}
                  alt={home.houseName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Compact Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Compact Favorite Button */}
              {/* <button className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
              </button> */}

              {/* Compact Rating Badge */}
              {home.houseRate > 0 && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-1 rounded-full flex items-center shadow-lg">
                  <Star className="w-3 h-3 text-white fill-current" />
                  <span className="mr-1 text-white text- x s font-bold">
                    {home.houseRate.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Compact Content Section */}
            <div className="p-4 flex flex-col flex-grow">
              {/* Compact Title and Location */}
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                  {home.houseName}
                </h3>
                <div className="flex items-center text-gray-500 ">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0 text-blue-500" />
                  <span className="truncate">
                    {home.city && home.street ? `${home.city}, ${home.street}` : "الموقع غير محدد"}
                  </span>
                </div>
              </div>

              {/* Compact Description */}
              <div className="mb-3 flex-shrink-0">
                <p className="text-gray-600  line-clamp-1 leading-relaxed">
                  {home.houseDescription}
                </p>
              </div>

              {/* Compact Price Section */}
              <div className="flex items-baseline justify-between mb-3 flex-shrink-0">
                <div>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {home.dailyCost?.toLocaleString()} جنيه
                  </span>
                  <span className="text-gray-500 text-xs mr-1">/ ليلة</span>
                </div>
                {home.numOfRaters > 0 && (
                  <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">
                    ({home.numOfRaters})
                  </span>
                )}
              </div>

              {/* Compact CTA Button */}
              <Link to={`/ad/${home.advertisementId}`} className="w-full mt-auto">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-3 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 ">
                  عرض التفاصيل
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Empty State */}
      {(!filteredAdvertisements || filteredAdvertisements.length === 0) && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">لا توجد عقارات متاحة</h3>
          <p className="text-gray-500 text-base max-w-md mx-auto">جرب تعديل معايير البحث للعثور على عقارات أخرى</p>
        </div>
      )}
    </div>
  );
};

export default HomesGrid;