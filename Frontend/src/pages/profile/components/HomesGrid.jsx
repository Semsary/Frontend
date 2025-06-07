import React from 'react';
import { MapPin, Building2, MoreVertical } from 'lucide-react';
import { getAllGovernorates } from 'egylist'

const HomesGrid = () => {
    // Sample data based on your JSON structure

    const Cities = getAllGovernorates();

    const getCitiesByGovernorateId = (governorateId) => {
        const city = Cities.find(city => city.id == governorateId);
        return city ? city.name_ar : "غير معروف";
    }

    const homesList = [
        {
            id: 1,
            _gover: 3,
            _city: "الرياض",
            street: "شارع الملك فهد",
            status: 1
        },
        {
            id: 2,
            _gover: 1,
            _city: "جدة",
            street: "شارع التحلية",
            status: 0
        },
        {
            id: 3,
            _gover: 2,
            _city: "الدمام",
            street: "شارع الأمير محمد بن فهد",
            status: 1
        },
        {
            id: 4,
            _gover: 6,
            _city: "الرياض",
            street: "شارع العليا",
            status: 1
        },
        {
            id: 5,
            _gover: 1,
            _city: "جدة",
            street: "شارع الكورنيش",
            status: 0
        },
        {
            id: 6,
            _gover: 3,
            _city: "مكة المكرمة",
            street: "شارع إبراهيم الخليل",
            status: 1
        }
    ];

    const getStatusText = (status) => {
        return status === 1 ? "متاح" : "غير متاح";
    };

    return ( 
        <div className="  min -h-screen">
            {/* Header */}
            <div className="mb-6">
                       <p className="text-gray-600">
                    {homesList.length} عقار مُسجل
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {homesList.map((home) => (
                    <div
                        key={home.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-900">
                                    عقار #{home.id}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${home.status === 1
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {getStatusText(home.status)}
                                </span>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <div>
                                <p className="text-sm text-gray-500">المحافظة</p>
                                    <p className="text-gray-900">{getCitiesByGovernorateId(home._gover)}</p>
                                </div>
                            </div>


                            <div>
                                <p className="text-gray-900 font-medium">{home._city} - {home.street}</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                            عرض التفاصيل
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomesGrid;