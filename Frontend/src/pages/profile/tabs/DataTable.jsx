import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../../config/api/axiosInstance';

const ArabicDataTable = () => {
  const [selectedImages, setSelectedImages] = useState(null);
    const [data, setData] = useState([
        {
            "imageURLS": [
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZW88ZXH1P1R05PAMB5W99Y.png",
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZW8AKPZ5K782V2ZSYF7K2Q.png",
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZW8B8N3M7XVGGFQCW1BBJN.png"
            ],
            "submitedAt": "2025-06-05T11:05:11.0280659Z",
            "reviewedAt": "0001-01-01T00:00:00",
            "status": 0,
            "comment": null
        },
        {
            "imageURLS": [
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZW8N0Y1N8YDNQQEXH7K583.png",
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZW8NDQPJNGSDK9ZFPF7N3F.png",
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZW8NQ0AHMVA4X7CQYNJFVJ.png"
            ],
            "submitedAt": "2025-06-05T11:05:21.7179033Z",
            "reviewedAt": "0001-01-01T00:00:00",
            "status": 0,
            "comment": null
        },
        {
            "imageURLS": [
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZWNNNS07Y7Y9Y935E3R12Y.png",
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZWNP9MPCTMAWWXKSNAW626.png",
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZWNPQRNQ1TEGSZ82PN42VZ.png"
            ],
            "submitedAt": "2025-06-05T11:12:28.713464Z",
            "reviewedAt": "0001-01-01T00:00:00",
            "status": 0,
            "comment": null
        },
        {
            "imageURLS": [
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZWV2HJ4ECJE5G1EGTC01VF.png",
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZWV4ARKWBZ7SQ8YMMF589N.png",
                "https://pub-768f1d211dce4bb781d848de87525d29.r2.dev/01JWZWV4MCQH9BN5C07WC5TDVG.png"
            ],
            "submitedAt": "2025-06-05T11:15:26.8157048Z",
            "reviewedAt": "0001-01-01T00:00:00",
            "status": 0,
            "comment": null
        }
    ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
          const response = await axiosInstance.get('/Auth/GetIdentity');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('حدث خطأ في تحميل البيانات');
        console.error('Error fetching data:', err);
    } finally {
         
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (dateString === "0001-01-01T00:00:00") return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            في انتظار المراجعة
          </span>
        );
      case 1:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            مقبول
          </span>
        );
      case 2:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            مرفوض
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            غير معروف
          </span>
        );
    }
  };

  const openImageModal = (images) => {
    setSelectedImages(images);
  };

  const closeImageModal = () => {
    setSelectedImages(null);
  };

  return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow" dir="rtl">
      <div className="max-w-full mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                المراجعات المرسلة
              </h2>
        
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-400 ml-3">⚠️</div>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ التقديم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ المراجعة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التعليق
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openImageModal(item.imageURLS)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        >
                          عرض الصور ({item.imageURLS.length})
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(item.submitedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(item.reviewedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.comment || "لا يوجد تعليق"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImages && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-full overflow-auto shadow-2xl">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">الصور المرفقة</h3>
                <button
                  onClick={closeImageModal}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedImages.map((imageUrl, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                      <img
                        src={imageUrl}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => window.open(imageUrl, '_blank')}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDIwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgOTZMMTAwIDk2WiIgc3Ryb2tlPSIjOUI5QjlCIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB4PSI4MCIgeT0iNzYiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Qjk4OTgiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMSAxNS0zLjA4Ni0zLjA4NmEyIDIgMCAwIDAtMi44MjggMEwxMiAxNW0wIDBoLTNhNSA1IDAgMCAwLTUgNSIvPgo8cGF0aCBkPSJNNCA1aDJhMiAyIDAgMCAxIDIgMnYxYTIgMiAwIDAgMSAyIDJoMWEyIDIgMCAwIDEgMiAyVjdBMiAyIDAgMCAxIDkgNWgtMnoiLz4KPHA+PC9wPgo8L3N2Zz4KPHN2Zz4K';
                        }}
                      />
                      <div className="p-2 bg-gray-50">
                        <p className="text-xs text-gray-600 text-center">صورة {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArabicDataTable;