import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'

const Page404 = () => {
    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate('/')
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (

        <>


            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4" dir="rtl">
            <Navbar searchBar={false} />
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>

                {/* Main Container */}
                <div className="max-w-lg w-full text-center space-y-8 relative">
                    {/* Illustration */}
                    <div className="mb-8">
                        <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                            <div className="text-white text-6xl font-bold">404</div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-gray-800 font-arabic">
                            عذراً، الصفحة غير موجودة
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed font-arabic max-w-md mx-auto">
                            لا يمكننا العثور على الصفحة التي تبحث عنها.
                            ربما تم نقلها أو حذفها.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <button
                                onClick={handleGoHome}
                                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 font-arabic"
                            >
                                العودة للرئيسية
                            </button>

                            <button
                                onClick={handleGoBack}
                                className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-300 text-gray-700 rounded-full font-medium transition-all duration-200 hover:shadow-md font-arabic"
                            >
                                الصفحة السابقة
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
                </div>

                <style jsx>{`
                .animation-delay-1000 { animation-delay: 1s; }
                .font-arabic {
                    font-family: 'Cairo', 'Segoe UI', 'Tahoma', sans-serif;
                }
            `}</style>
            </div>
        </>
    )
}

export default Page404