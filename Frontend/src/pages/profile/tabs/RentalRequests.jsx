import React, { useState, useEffect } from 'react';
import { Calendar, User, DollarSign, Home, Clock, Eye, MessageCircle } from 'lucide-react';
import RentalRequestsModal from '../components/RentalRequestsModal';
import useHouseStore from '../../../store/house.store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RentalRequests = () => {
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { getRentalRequests } = useHouseStore()
  const navigate = useNavigate();



  const handleContactTenant = (request) => {
    if (request.username) {
      navigate(`/chat/${request.username}`);
    } else {
      toast.error('معلومات المالك غير متوفرة', {
        position: 'top-right',
        duration: 3000,
      });
    }
  };


  // Mock data - replace with actual API call
  useEffect(() => {
    
    const fetchRentalRequests = async () => {
      setLoading(true);
      try {
        const requests = await getRentalRequests();
        setRentalRequests(requests);
      } catch (error) {
        console.error('Error fetching rental requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalRequests();
   
  }, []);

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
                      {request.firstname} {request.lastname}
                    </h3>
                    <p className="text-sm text-gray-500">طلب رقم #{request.rentalId}</p>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                  قيد المراجعة
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

              {/* Action Button */}
                <button
                                onClick={() => handleContactTenant(request)}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mb-2"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">تواصل مع المستأجر</span>
                              </button>
              
              <button
                onClick={() => handleViewRequest(request)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                عرض التفاصيل واتخاذ إجراء
              </button>
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
    </div>
  );
};

export default RentalRequests;
