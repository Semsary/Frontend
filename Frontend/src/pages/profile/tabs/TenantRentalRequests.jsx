import React, { useState, useEffect } from 'react';
import { Calendar, User, DollarSign, Home, Clock, Eye, Star, MessageCircle } from 'lucide-react';
import RentalRequestsModal from '../components/RentalRequestsModal';
import RatingModal from '../components/RatingModal';
import useHouseStore from '../../../store/house.store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const TenantRentalRequests = () => {
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRatingRequest, setSelectedRatingRequest] = useState(null);
  const { getTenantRentalRequests, cancelRentalRequest, acceptArivalRequest, handleRating } = useHouseStore()
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  useEffect(() => {

    const fetchRentalRequests = async () => {
      setLoading(true);
      try {
        const requests = await getTenantRentalRequests();
        console.log("Fetched Rental Requests:", requests);
        setRentalRequests(requests);
      } catch (error) {
        console.error('Error fetching rental requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalRequests();

  }, []);


  const handleCancelRequest = async (rentalId) => {
    if (window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
      try {
        await cancelRentalRequest(rentalId);
        setRentalRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== rentalId)
        );
      } catch (error) {
        console.error('Error canceling rental request:', error);
      }
    }
  };

  const handleAcceptRequest = async (rentalId) => {
    if (window.confirm('هل أنت متأكد من قبول هذا الطلب؟')) {
      try {
        await acceptArivalRequest(rentalId);
        setRentalRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === rentalId ? { ...request, status: 1 } : request
          )
        );
      } catch (error) {
        console.error('Error accepting rental request:', error);
      }
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleRequestUpdate = (updatedRequests) => {
    setRentalRequests(updatedRequests);
  };

  const handleRateRequest = (request) => {
    setSelectedRatingRequest(request);
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedRatingRequest(null);
  };

  const handleRatingSubmit = async (rentalId, rating, comment, houseId) => {
    try {
      // Add your rating submission logic here
      console.log('Submitting rating:', { rentalId, rating, comment, houseId });

      const res = await handleRating(rentalId, rating, comment, houseId);

      if (res) {
        // Update the request status after successful rating
        setRentalRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.rentalId === rentalId ? { ...request, status: 6, rating, comment } : request
          )
        );
        toast.success('تم إرسال التقييم بنجاح', {
          position: 'top-right',
          duration: 3000,
          style: {
            backgroundColor: '#f0f4f8',
            color: '#333',
            fontSize: '16px',
            borderRadius: '8px',
            padding: '12px 20px'
          }
        });
      }



      // You can add a success message here

    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  };

  const handleContactLandlord = (request) => {
    if (request.houseOwnerUsername) {
      navigate(`/chat/${request.houseOwnerUsername}`);
    } else {
      toast.error('معلومات المالك غير متوفرة', {
        position: 'top-right',
        duration: 3000,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} يوم`;
    } else if (diffDays < 365) {
      const months = Math.round(diffDays / 30);
      return `${months} شهر`;
    } else {
      const years = Math.round(diffDays / 365);
      return `${years} سنة`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">طلبات الإيجار</h2>
        <p className="text-gray-600">إدارة جميع طلبات الإيجار الواردة</p>
      </div>

      {/* Rental Requests Grid */}
      {rentalRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد طلبات إيجار</h3>
          <p className="text-gray-500">لم يتم استلام أي طلبات إيجار حتى الآن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalRequests.map((request) => (
            <div
              key={request.rentalId}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Request Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {request.houseName || request.houseName[0]}
                    </h3>
                    <p className="text-sm text-gray-500">طلب رقم #{request.rentalId}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${request.status === 0
                  ? 'bg-yellow-100 text-yellow-800'  // قيد المراجعة
                  : request.status === 1
                    ? 'bg-green-100 text-green-800'  // تم الموافقة
                    : request.status === 2
                      ? 'bg-red-100 text-red-800'    // تم الرفض
                      : request.status === 3
                        ? 'bg-orange-100 text-orange-800'  // في انتظار موافقة الوصول
                        : request.status === 4
                          ? 'bg-yellow-100 text-yellow-800'  // قيم تجربتك
                          : request.status === 5
                            ? 'bg-red-100 text-red-800'    // تم رفض طلب الوصول
                            : request.status === 6
                              ? 'bg-blue-100 text-blue-800'  // تم التقييم
                              : 'bg-gray-100 text-gray-800'  // حالة غير معروفة
                  }`}>
                  {
                    request.status === 0
                      ? 'قيد المراجعة'
                      : request.status === 1
                        ? 'تم الموافقة'
                        : request.status === 2
                          ? request.statusText || 'تم الرفض'
                          : request.status === 3
                            ? 'في انتظار موافقة الوصول'
                            : request.status === 4
                              ? 'قيم تجربتك'
                              : request.status === 5
                                ? 'تم رفض طلب الوصول'
                                : request.status === 6
                                  ? 'تم التقييم'
                                  : 'حالة غير معروفة'
                  }
                </span>
              </div>

              {/* Request Details */}
              <div className="space-y-3 mb-6">
                {/* Warranty Money */}
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">مبلغ الضمان:</span>
                  <span className="font-semibold text-gray-900">
                    {request.warrantyMoney.toLocaleString()} جنيه
                  </span>
                </div>

                {/* Rental Period */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">فترة الإيجار:</span>
                  <span className="font-medium text-gray-900">
                    {calculateDuration(request.startDate, request.endDate)}
                  </span>
                </div>

                {/* Start Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">تاريخ البداية:</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(request.startDate)}
                  </span>
                </div>

                {/* End Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">تاريخ النهاية:</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(request.endDate)}
                  </span>
                </div>

                {/* Arrival Period */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">فترة الوصول المفضلة</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>من: {formatDateTime(request.startArrivalDate)}</div>
                    <div>إلى: {formatDateTime(request.endArrivalDate)}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {/* Contact Landlord Button - Always Available */}
                <button
                  onClick={() => handleContactLandlord(request)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mb-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">تواصل مع المالك</span>
                </button>

                {request.status === 0 ? (
                  // قيد المراجعة - Under Review
                  <div className="flex gap-2">
                    {/* <button
                      onClick={() => handleViewRequest(request)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">عرض التفاصيل</span>
                    </button> */}
                    <button
                      onClick={() => handleCancelRequest(request.rentalId)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                    >
                      إلغاء الطلب
                    </button>
                  </div>
                ) : request.status === 1 ? (
                  // تم الموافقة - Approved
                  <button
                    onClick={() => handleAcceptRequest(request.rentalId)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">تأكيد الوصول</span>
                  </button>
                ) : request.status === 2 ? (
                  // تم الرفض - Rejected
                  <div className="w-full bg-red-50 border-2 border-red-200 text-red-700 font-medium py-3 px-4 rounded-lg text-center">
                    <span className="flex items-center justify-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      تم رفض الطلب
                    </span>
                  </div>
                ) : request.status === 3 ? (
                  // في انتظار موافقة الوصول - Waiting for Arrival Approval
                  <div className="w-full bg-orange-50 border-2 border-orange-200 text-orange-700 font-medium py-3 px-4 rounded-lg text-center">
                    <span className="flex items-center justify-center gap-2 text-sm">
                      <Clock className="w-4 h-4 animate-spin" />
                      في انتظار موافقة الوصول
                    </span>
                  </div>
                ) : request.status === 4 ? (
                  // المؤجر في انتظارك - Rate Experience
                  <button
                    onClick={() => handleRateRequest(request)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Star className="w-4 h-4" />
                    <span className="text-sm">قيم تجربتك</span>
                  </button>
                ) : request.status === 5 ? (
                  // تم رفض طلب الوصول - Arrival Request Rejected
                  <div className="w-full bg-red-50 border-2 border-red-200 text-red-700 font-medium py-3 px-4 rounded-lg text-center">
                    <span className="flex items-center justify-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      تم رفض طلب الوصول
                    </span>
                  </div>
                ) : (
                  // حالة غير معروفة - Unknown Status
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 border-2 border-gray-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">عرض التفاصيل</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedRequest && (
        <RentalRequestsModal
          request={selectedRequest}
          closeModal={handleCloseModal}
          onRequestUpdate={handleRequestUpdate}
        />
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedRatingRequest && (
        <RatingModal
          request={selectedRatingRequest}
          closeModal={handleCloseRatingModal}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default TenantRentalRequests;
