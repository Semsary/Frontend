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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          العقارات المتاحة
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          اكتشف مجموعة واسعة من العقارات المميزة التي تناسب احتياجاتك
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredAdvertisements?.map((home) => (
          <div
            key={home.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50 hover:border-blue-200 hover:-translate-y-2 flex flex-col h-full backdrop-blur-sm hover:bg-white/95"
          >
            {/* Enhanced Image Section */}
            <div className="relative overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={home.images?.[0]}
                  alt={home.houseName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Enhanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Enhanced Favorite Button */}
              <button className="absolute top-4 left-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-xl border border-white/20">
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200" />
              </button>

              {/* Enhanced Rating Badge */}
              {home.houseRate > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 rounded-full flex items-center shadow-xl border border-white/20">
                  <Star className="w-4 h-4 text-white fill-current" />
                  <span className="mr-1 text-white text-sm font-bold">
                    {home.houseRate.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Content Section */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Enhanced Title and Location */}
              <div className="mb-4 h-16">
                <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                  {home.houseName}
                </h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0 text-blue-500" />
                  <span className="truncate">
                    {home.city && home.street ? `${home.city}, ${home.street}` : "الموقع غير محدد"}
                  </span>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="mb-6 h-10 flex-shrink-0">
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {home.houseDescription}
                </p>
              </div>

              {/* Enhanced Price Section */}
              <div className="flex items-baseline justify-between mb-6 flex-shrink-0">
                <div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {home.dailyCost?.toLocaleString()} جنيه
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ ليلة</span>
                </div>
                {home.numOfRaters > 0 && (
                  <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">
                    ({home.numOfRaters} تقييم)
                  </span>
                )}
              </div>

              {/* Enhanced CTA Button */}
              <Link to={`/ad/${home.advertisementId}`} className="w-full mt-auto">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95 text-sm">
                  عرض التفاصيل
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {(!filteredAdvertisements || filteredAdvertisements.length === 0) && (
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">لا توجد عقارات متاحة</h3>
          <p className="text-gray-500 text-lg max-w-md mx-auto">جرب تعديل معايير البحث للعثور على عقارات أخرى</p>
        </div>
      )}
    </div>
  );
};

export default HomesGrid;