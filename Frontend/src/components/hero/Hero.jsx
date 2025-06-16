import React from "react";
import { Search, MapPin, Home, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden" dir="rtl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="text-center">
                    {/* Main Heading */}
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                        اكتشف منزل أحلامك مع
                        <span className="text-blue-600"> سمساري</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        استكشف آلاف العقارات المميزة واعثر على المكان المثالي لإقامتك القادمة
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="relative bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                {/* Location Input */}
                                <div className="relative">
                                    <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="المدينة أو المنطقة"
                                        className="w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Check-in Date */}
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Check-out Date */}
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Search Button */}
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                    <Search className="w-5 h-5 ml-2" />
                                    بحث
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                            استكشف العقارات
                        </button>
                        <Link
                            to="/signup/landlord"
                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200">
                            سجل ك سمسار
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute bottom-10 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-green-200 rounded-full opacity-30"></div>
        </div>
    );
};

export default Hero;
