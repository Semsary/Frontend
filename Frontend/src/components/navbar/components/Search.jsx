import React, { useState, useEffect } from "react";
import { Search as SearchIcon, MapPin, Home, DollarSign, X, RotateCcw, Loader2 } from "lucide-react";

const Search = () => {
  // Mock store functions for demo
  const setSearchFilters = (filters) => console.log('Search filters:', filters);
  const getAdvertisements = () => console.log('Getting advertisements...');

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
    }, 1000);
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

      {/* Compact Search Bar */}
      <div className={`transition-all duration-500 ${isExpanded ? 'opacity-0 pointer-events-none transform scale-95' : 'opacity-100 transform scale-100'}`}>
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1.5 w-80 sm:w-96 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-1 px-3 sm:px-4">
              <input
                type="text"
                placeholder="إلى أين تريد الذهاب؟"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={toggleExpanded}
                className="w-full text-sm placeholder-gray-500 border-none outline-none bg-transparent font-medium"
              />
            </div>
            <button
              onClick={isExpanded ? handleSearch : toggleExpanded}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2.5 sm:p-3 rounded-full transition-all duration-200 flex items-center justify-center"
            >
              <SearchIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Search Form - Fixed positioning */}
      <div className={`fixed top-4 left-4 right-4 bottom-4 sm:top-[10%] sm:left-1/2 sm:right-auto sm:bottom-auto sm:transform sm:-translate-x-1/2 sm:max-w-[900px] sm:w-full z-50 transition-all duration-500 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 w-full h-full sm:h-auto max-h-full sm:max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8" dir="rtl">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                البحث عن العقارات
              </h3>
              <p className="text-gray-600 text-sm">اكتشف أفضل الخيارات المتاحة للإيجار</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8" dir="rtl">
            {/* Location */}
            <div className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${focusedField === 'location' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                المكان
              </label>
              <select
                name="governorate"
                value={filters.governorate}
                onChange={handleChange}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
                className="w-full text-sm border-none outline-none bg-transparent cursor-pointer text-gray-700"
              >
                <option value="">اختر المحافظة</option>
                <option value={1}>القاهرة</option>
                <option value={2}>الجيزة</option>
                <option value={3}>الاسكندرية</option>
              </select>
            </div>

            {/* Rental Type */}
            <div className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${focusedField === 'rental' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4 text-blue-600" />
                نوع الإيجار
              </label>
              <select
                name="rentalType"
                value={filters.rentalType}
                onChange={handleChange}
                onFocus={() => setFocusedField('rental')}
                onBlur={() => setFocusedField(null)}
                className="w-full text-sm border-none outline-none bg-transparent cursor-pointer text-gray-700"
              >
                <option value="">اختر المدة</option>
                <option value="daily">إيجار يومي</option>
                <option value="monthly">إيجار شهري</option>
              </select>
            </div>

            {/* Price From */}
            <div className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${focusedField === 'priceFrom' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
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
                className="w-full text-sm border-none outline-none bg-transparent placeholder-gray-400"
              />
            </div>

            {/* Price To */}
            <div className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${focusedField === 'priceTo' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
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
                className="w-full text-sm border-none outline-none bg-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-4 sm:mb-6" dir="rtl">
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة تعيين
            </button>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4" />
                  البحث
                </>
              )}
            </button>
          </div>

          {/* Quick Filters */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200" dir="rtl">
            <p className="text-sm text-gray-600 mb-3 font-medium">عمليات بحث سريعة:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "القاهرة - إيجار يومي", filters: { governorate: "1", rentalType: "daily" } },
                { label: "الجيزة - إيجار شهري", filters: { governorate: "2", rentalType: "monthly" } },
                { label: "الاسكندرية - إيجار يومي", filters: { governorate: "3", rentalType: "daily" } },
              ].map((quickFilter, index) => (
                <button
                  key={index}
                  onClick={() => setFilters(prev => ({ ...prev, ...quickFilter.filters }))}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-200"
                >
                  {quickFilter.label}
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