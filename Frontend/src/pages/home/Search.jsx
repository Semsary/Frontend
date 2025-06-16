import React, { useState, useEffect } from "react";
import useHomesStore from "../../store/house.store";

const Search = () => {
    const { setSearchFilters, getAdvertisements } = useHomesStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchText, setSearchText] = useState("");

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
        setSearchFilters(filters);
        await getAdvertisements();
        setIsExpanded(false);
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="sticky top-4 z-50 mx-4 my-6">
            {/* Compact Search Bar */}
            <div
                className={`transition-all duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 max-w-2xl mx-auto">
                    <div className="flex items-center">
                        <div className="flex-1 px-4">
                            <input
                                type="text"
                                placeholder="إلى أين تريد الذهاب؟"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onClick={toggleExpanded}
                                className="w-full text-sm placeholder-gray-500 border-none outline-none bg-transparent"
                            />
                        </div>
                        <button
                            onClick={isExpanded ? handleSearch : toggleExpanded}
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors duration-200 flex items-center justify-center"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Search Form */}
            <div
                className={`transition-all duration-300 ${isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">ابحث عن مكان الإقامة</h3>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Search Inputs Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1 border border-gray-200 rounded-2xl p-2 mb-6">

                        {/* Location */}
                        <div className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer border-r border-gray-200 last:border-r-0">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">المكان</label>
                            <select
                                name="governorate"
                                value={filters.governorate}
                                onChange={handleChange}
                                className="w-full text-sm border-none outline-none bg-transparent cursor-pointer"
                            >
                                <option value="">أين تريد الذهاب؟</option>
                                <option value={1}>القاهرة</option>
                                <option value={2}>الجيزة</option>
                                <option value={3}>الاسكندرية</option>
                            </select>
                        </div>

                        {/* Rental Type */}
                        <div className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer border-r border-gray-200 last:border-r-0">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">نوع الإقامة</label>
                            <select
                                name="rentalType"
                                value={filters.rentalType}
                                onChange={handleChange}
                                className="w-full text-sm border-none outline-none bg-transparent cursor-pointer"
                            >
                                <option value="">اختر المدة</option>
                                <option value="daily">يومي</option>
                                <option value="monthly">شهري</option>
                            </select>
                        </div>

                        {/* Price From */}
                        <div className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer border-r border-gray-200 last:border-r-0">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">السعر من</label>
                            <input
                                type="number"
                                name={filters.rentalType === 'daily' ? 'MinDailyCost' : 'MinMonthlyCost'}
                                value={filters.rentalType === 'daily' ? filters.MinDailyCost : filters.MinMonthlyCost}
                                onChange={handleChange}
                                placeholder="أقل سعر"
                                className="w-full text-sm border-none outline-none bg-transparent placeholder-gray-400"
                            />
                        </div>

                        {/* Price To */}
                        <div className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">السعر إلى</label>
                            <input
                                type="number"
                                name={filters.rentalType === 'daily' ? 'MaxDailyCost' : 'MaxMonthlyCost'}
                                value={filters.rentalType === 'daily' ? filters.MaxDailyCost : filters.MaxMonthlyCost}
                                onChange={handleChange}
                                placeholder="أعلى سعر"
                                className="w-full text-sm border-none outline-none bg-transparent placeholder-gray-400"
                            />
                        </div>

                    </div>

                    {/* Search Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            البحث
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;