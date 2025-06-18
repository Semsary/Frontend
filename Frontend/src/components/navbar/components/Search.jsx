import React, { useState, useEffect } from "react";
import { Search as SearchIcon, MapPin, Home, DollarSign, X, RotateCcw, Loader2 } from "lucide-react";
import useHomesStore from "../../../store/house.store"; // Adjust the import path as needed
import { getAllGovernorates, getCitiesByGovernorateId } from 'egylist';

const Search = () => {
  // // Mock store functions for demo
  // const setSearchFilters = (filters) => console.log('Search filters:', filters);
  // const getAdvertisements = () => console.log('Getting advertisements...');
  const { setSearchFilters, getAdvertisements } = useHomesStore();
  const GovernorateList = getAllGovernorates();



  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [filters, setFilters] = useState({
    governorate: "",
    MinMonthlyCost: "",
    MaxMonthlyCost: "",
    MinDailyCost: "",
    MaxDailyCost: "",
    rentalType: "",
  });

  // Handle scroll to show/hide expanded view
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchFilters(filters);

    // Simulate API call
    setTimeout(async () => {
      await getAdvertisements();
      setIsLoading(false);
      setIsExpanded(false);
    }, 10);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const clearFilters = () => {
    setFilters({
      governorate: "",
      MinMonthlyCost: "",
      MaxMonthlyCost: "",
      MinDailyCost: "",
      MaxDailyCost: "",
      rentalType: "",
    });
    setSearchText("");
  };

  return (
    <div className="relative">
      {/* Background overlay when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Compact Search Bar - Enhanced mobile responsiveness */}
      <div className={`transition-all duration-500 ${isExpanded ? 'opacity-0 pointer-events-none transform scale-95' : 'opacity-100 transform scale-100'}`}>
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1 sm:p-1.5 w-48 sm:w-72 md:w-80 lg:w-96 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-1 px-2 sm:px-3 md:px-4">
              <input
                type="text"
                placeholder="إلى أين تريد الذهاب؟"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={toggleExpanded}
                className="w-full text-xs sm:text-sm placeholder-gray-500 border-none outline-none bg-transparent font-medium"
              />
            </div>
            <button
              onClick={isExpanded ? handleSearch : toggleExpanded}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-1.5 sm:p-2.5 md:p-3 rounded-full transition-all duration-200 flex items-center justify-center min-w-[28px] min-h-[28px] sm:min-w-[36px] sm:min-h-[36px]"
            >
              <SearchIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Search Form - Enhanced mobile positioning */}
      <div className={`fixed inset-0 sm:top-4 sm:left-4 sm:right-4 sm:bottom-auto sm:inset-auto sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:max-w-[900px] sm:w-full z-50 transition-all duration-500 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-white sm:rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8 w-full h-full sm:h-auto max-h-full sm:max-h-[80vh] overflow-y-auto">
          {/* Header - Enhanced mobile spacing */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8" dir="rtl">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1">
                البحث عن العقارات
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">اكتشف أفضل الخيارات المتاحة للإيجار</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Inputs - Enhanced mobile grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8" dir="rtl">
            {/* Location - Enhanced mobile touch targets */}
            <div className={`relative p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${focusedField === 'location' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                المكان
              </label>
              <select
                name="governorate"
                value={filters.governorate}
                onChange={handleChange}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
                className="w-full text-xs sm:text-sm border-none outline-none bg-transparent cursor-pointer text-gray-700 min-h-[24px]"
              >
                <option value={0}>اختر المحافظة</option>
                {GovernorateList.map((governorate) => (
                  <option key={governorate.id} value={governorate.id}>
                    {governorate.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Rental Type */}
            <div className={`relative p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${focusedField === 'rental' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <Home className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                نوع الإيجار
              </label>
              <select
                name="rentalType"
                value={filters.rentalType}
                onChange={handleChange}
                onFocus={() => setFocusedField('rental')}
                onBlur={() => setFocusedField(null)}
                className="w-full text-xs sm:text-sm border-none outline-none bg-transparent cursor-pointer text-gray-700 min-h-[24px]"
              >
                <option value={null}>اختر المدة</option>
                <option value={1}>إيجار يومي</option>
                <option value={2}>إيجار شهري</option>
              </select>
            </div>

            {/* Price From */}
            <div className={`relative p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${focusedField === 'priceFrom' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                السعر من
              </label>
              <input
                type="number"
                name={filters.rentalType === 'daily' ? 'MinDailyCost' : 'MinMonthlyCost'}
                value={filters.rentalType === 'daily' ? filters.MinDailyCost : filters.MinMonthlyCost}
                onChange={handleChange}
                onFocus={() => setFocusedField('priceFrom')}
                onBlur={() => setFocusedField(null)}
                placeholder="الحد الأدنى"
                className="w-full text-xs sm:text-sm border-none outline-none bg-transparent placeholder-gray-400 min-h-[24px]"
              />
            </div>

            {/* Price To */}
            <div className={`relative p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${focusedField === 'priceTo' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                السعر إلى
              </label>
              <input
                type="number"
                name={filters.rentalType === 'daily' ? 'MaxDailyCost' : 'MaxMonthlyCost'}
                value={filters.rentalType === 'daily' ? filters.MaxDailyCost : filters.MaxMonthlyCost}
                onChange={handleChange}
                onFocus={() => setFocusedField('priceTo')}
                onBlur={() => setFocusedField(null)}
                placeholder="الحد الأقصى"
                className="w-full text-xs sm:text-sm border-none outline-none bg-transparent placeholder-gray-400 min-h-[24px]"
              />
            </div>
          </div>

          {/* Action Buttons - Enhanced mobile layout */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6" dir="rtl">
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm md:text-base min-h-[40px] sm:min-h-[44px]"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              إعادة تعيين
            </button>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-all duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] text-xs sm:text-sm md:text-base min-h-[40px] sm:min-h-[44px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <SearchIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  البحث
                </>
              )}
            </button>
          </div>

          {/* Quick Filters - Enhanced mobile layout */}
          <div className="pt-3 sm:pt-4 md:pt-6 border-t border-gray-200" dir="rtl">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-medium">عمليات بحث سريعة:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {/*
                { label: "القاهرة - إيجار يومي", filters: { governorate: "1", rentalType: "daily" } },
                { label: "الجيزة - إيجار شهري", filters: { governorate: "2", rentalType: "monthly" } },
                { label: "الاسكندرية - إيجار يومي", filters: { governorate: "3", rentalType: "daily" } },
              */}
              {GovernorateList.filter(g => g.id !== 0).map((quickFilter, index) => (
                <button
                  key={index}
                  onClick={() => setFilters(prev => ({ ...prev, governorate: quickFilter.id, rentalType: "daily" }))}
                  className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-200 min-h-[28px] sm:min-h-[32px]"
                >
                  {quickFilter.name_ar} - إيجار يومي
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;