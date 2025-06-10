import { Home, X } from 'lucide-react'
import React from 'react'

const InspectModal = ({ closeModal, home }) => {



    return (
        <div>
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Home className="h-5 w-5 text-indigo-600" />
                            إضافة عقار جديد
                        </h3>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">طلب معاينة للعقار</h2>
                        <p className="text-gray-600 mb-4">
                            في حال رغبتك في معاينة العقار، سيتم التواصل معك من قبل أحد ممثلي خدمة العملاء لتحديد موعد المعاينة.
                        </p>
                        <p className="text-gray-600 mb-4">
                            في العنوان التالي: {home.street}, {home.city}
                        </p>

                        <button
                            onClick={closeModal}
                            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200"
                        >
                            <span>إرسال طلب المعاينة</span>
                        </button>

                        <button
                            onClick={closeModal}
                            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <span>إغلاق</span>
                        </button>





                    </div>
                </div>
            </div>

        </div>
    )
}

export default InspectModal
