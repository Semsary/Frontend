import React, { useState } from "react";
import { Search, MapPin, Home, Users, DollarSign, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import useHomesStore from "../../store/house.store";
import { getAllGovernorates } from 'egylist';

const Hero = () => {
    const { setSearchFilters, getAdvertisements } = useHomesStore();
    const GovernorateList = getAllGovernorates();

    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        governorate: "",
        MinMonthlyCost: "",
        MaxMonthlyCost: "",
        MinDailyCost: "",
        MaxDailyCost: "",
        rentalType: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = async () => {
        setIsLoading(true);
        const formattedFilters = {
            ...filters,
            MinMonthlyCost: filters.MinMonthlyCost ? parseFloat(filters.MinMonthlyCost) : null,
            MaxMonthlyCost: filters.MaxMonthlyCost ? parseFloat(filters.MaxMonthlyCost) : null,
            MinDailyCost: filters.MinDailyCost ? parseFloat(filters.MinDailyCost) : null,
            MaxDailyCost: filters.MaxDailyCost ? parseFloat(filters.MaxDailyCost) : null,
            rentalType: filters.rentalType ? parseInt(filters.rentalType) : null,
        };
        setSearchFilters(formattedFilters);
        console.log("Search Filters:", formattedFilters);

        setTimeout(async () => {
            await getAdvertisements();
            setIsLoading(false);
        }, 10);
    };

    return (
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden" dir="rtl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="text-center">
                    {/* Mobile Logo Section */}
                    <div className="block md:hidden mb-8">
                        <div className="flex justify-center items-center mb-4">
                            {/* <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <Home className="w-8 h-8 text-white" />
                            </div> */}

                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/luxor-uni.firebasestorage.app/o/Ar.png?alt=media&token=413c3087-7cad-4b40-809e-74c27b5f53e7"
                                alt="logo"
                                className="h-16 sm:h-16 md:h-20 lg:h-24 transition-all duration-300 group-hover:scale-105   mr-2"
                            />
                        </div>
                        {/* <h2 className="text-xl font-bold text-blue-600 mb-2">سمساري</h2>
                        <p className="text-sm text-gray-600">منصة العقارات الرائدة</p> */}
                    </div>

                    {/* Main Heading - Enhanced for Mobile */}
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
                        اكتشف منزل أحلامك مع
                        <span className="text-blue-700"> سمساري</span>
                    </h1>

                    {/* Subtitle - Enhanced for Mobile */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                        استكشف العقارات المميزة واعثر على المكان المثالي لإقامتك القادمة
                    </p>

                    {/* Enhanced Search Bar - Hidden on Mobile */}
                    <div className="hidden md:block max-w-5xl mx-auto mb-12">
                        <div className="relative bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                                {/* Governorate Selection */}
                                <div className="relative">
                                    <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <select
                                        name="governorate"
                                        value={filters.governorate}
                                        onChange={handleChange}
                                        className="w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="">اختر المحافظة</option>
                                        {GovernorateList.map((governorate) => (
                                            <option key={governorate.id} value={governorate.id}>
                                                {governorate.name_ar}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Rental Type */}
                                <div className="relative">
                                    <Home className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <select
                                        name="rentalType"
                                        value={filters.rentalType}
                                        onChange={handleChange}
                                        className="w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                                    >
                                        <option value={null}>نوع الإيجار</option>
                                        <option value={1}>إيجار يومي</option>
                                        <option value={0}>إيجار شهري</option>
                                    </select>
                                </div>

                                {/* Price From */}
                                <div className="relative">
                                    <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name={filters.rentalType === 'daily' ? 'MinDailyCost' : 'MinMonthlyCost'}
                                        value={filters.rentalType === 'daily' ? filters.MinDailyCost : filters.MinMonthlyCost}
                                        onChange={handleChange}
                                        placeholder="السعر من"
                                        className="w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Price To */}
                                <div className="relative">
                                    <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name={filters.rentalType === 'daily' ? 'MaxDailyCost' : 'MaxMonthlyCost'}
                                        value={filters.rentalType === 'daily' ? filters.MaxDailyCost : filters.MaxMonthlyCost}
                                        onChange={handleChange}
                                        placeholder="السعر إلى"
                                        className="w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Search Button */}
                                <button
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center min-h-[42px]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                            جاري البحث...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5 ml-2" />
                                            بحث
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Quick Stats */}

                    {/* CTA Buttons - Enhanced for Mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 sm:py-2.5 px-8 sm:px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-base sm:text-sm">
                            استكشف العقارات
                        </button>
                        <Link
                            to="/signup/landlord"
                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-3 sm:py-2.5 px-8 sm:px-6 rounded-lg transition-all duration-200 text-base sm:text-sm text-center">
                            سجل ك سمسار
                        </Link>
                    </div>

                    {/* Mobile Search Button */}
                    <div className="block hidden mt-6">
                        <Link
                            to="/search"
                            className="inline-flex items-center justify-center bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md"
                        >
                            <Search className="w-5 h-5 ml-2" />
                            البحث المتقدم
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Elements - Adjusted for Mobile */}
            <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-8 sm:w-16 h-8 sm:h-16 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-6 sm:w-12 h-6 sm:h-12 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-4 sm:w-6 h-4 sm:h-6 bg-green-200 rounded-full opacity-30"></div>
        </div>
    );
};

export default Hero;
