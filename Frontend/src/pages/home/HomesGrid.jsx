import React from "react";
import { Heart, MapPin, Star } from "lucide-react";
import useHomesStore from "../../store/house.store";


const HomesGrid = ({ homes }) => {
  // Mock data for demonstration since we don't have the store
  const { filteredAdvertisements, loading, error } = useHomesStore();


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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAdvertisements?.map((home) => (
          <div
            key={home.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 hover:border-gray-200 hover:-translate-y-1 flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={home.images?.[0]}
                  alt={home.houseName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Favorite Button */}
              <button className="absolute top-4 left-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg">
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200" />
              </button>

              {/* Rating Badge */}
              {home.houseRate > 0 && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="mr-1 text-gray-800 text-sm font-semibold">
                    {home.houseRate.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Title and Location */}
              <div className="mb-4 h-16">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                  {home.houseName}
                </h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {home.city && home.street ? `${home.city}, ${home.street}` : "الموقع غير محدد"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 h-10 flex-shrink-0">
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {home.houseDescription}
                </p>
              </div>

              {/* Price Section */}
              <div className="flex items-baseline justify-between mb-4 flex-shrink-0">
                <div>
                  <span className="font-bold text-xl text-gray-900">
                    {home.dailyCost?.toLocaleString()} جنيه
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ ليلة</span>
                </div>
                {home.numOfRaters > 0 && (
                  <span className="text-gray-400 text-xs">
                    ({home.numOfRaters} تقييم)
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gray-900 hover:bg-blue-600 text-white font-medium py-2.5 px-3 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 text-sm mt-auto">
                عرض التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!filteredAdvertisements || filteredAdvertisements.length === 0) && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عقارات متاحة</h3>
          <p className="text-gray-500 text-sm">جرب تعديل معايير البحث للعثور على عقارات أخرى</p>
        </div>
      )}
    </div>
  );
};

export default HomesGrid;