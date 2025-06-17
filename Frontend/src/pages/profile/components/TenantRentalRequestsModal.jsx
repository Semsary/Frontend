import React, { useState } from 'react'

const TenantRentalRequestsModal = ({ request, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAction = async (action) => {
        setIsSubmitting(true)

        try {
            // Replace with actual API call
            const response = await fetch('/api/rental-requests/action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rentalId: request.rentalId,
                    status: action // 1 for approve, 2 for cancel
                })
            })

            if (response.ok) {
                // Handle success
                console.log(`Request ${action === 1 ? 'approved' : 'cancelled'} successfully`)
                onClose()
                // Optionally refresh the data or show success message
            } else {
                throw new Error('Failed to update request')
            }
        } catch (error) {
            console.error('Error updating request:', error)
            // Handle error - show error message
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!request) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="bg-blue-600 p-4 rounded-t-lg">
                    <h3 className="text-lg font-semibold text-white text-right">إجراء على طلب الإيجار</h3>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-900">{request.houseName[0]}</span>
                                <span className="text-gray-600">العقار</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-blue-600">#{request.rentalId}</span>
                                <span className="text-gray-600">رقم الطلب</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold text-green-600">{request.warrantyMoney} ريال</span>
                                <span className="text-gray-600">مبلغ الضمان</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleAction(1)}
                            disabled={isSubmitting}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            {isSubmitting ? 'جاري المعالجة...' : 'موافقة'}
                        </button>

                        <button
                            onClick={() => handleAction(2)}
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            {isSubmitting ? 'جاري المعالجة...' : 'إلغاء'}
                        </button>

                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TenantRentalRequestsModal
                            ) : (
    <div className="flex items-center justify-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>إلغاء</span>
    </div>
)}
                        </button >

    <button
        onClick={onClose}
        disabled={isSubmitting}
        className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border border-gray-200"
    >
        إغلاق
    </button>
                    </div >
                </div >
            </div >
        </div >
    )
}

export default TenantRentalRequestsModal
