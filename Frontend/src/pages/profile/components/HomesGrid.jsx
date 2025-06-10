import React, { useEffect, useState } from 'react';
import { MapPin, Building2, MoreVertical } from 'lucide-react';
import { getAllGovernorates } from 'egylist'
import useHouseStore from '../../../store/house.store';
import InspectModal from './InspectModal';

const HomesGrid = () => {

  const { getHouses } = useHouseStore();
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedHome, setSelectedHome] = useState(null);
  const [homesList, setHomesList] = useState([]);
  const Cities = getAllGovernorates();

  const getCitiesByGovernorateId = (governorateId) => {
    const city = Cities.find(city => city.id == governorateId);
    return city ? city.name_ar : "غير معروف";
  }

  useEffect(() => {
    const fetchHouses = async () => {
      const houses = await getHouses();
      console.table(houses);
      setHomesList(houses);
    };
    fetchHouses();
  }, []);



  const handleInspectModal = (home) => {
    setSelectedHome(home);
    setInspectModalOpen(true);
  };


  const getStatusText = (status) => {
    return status === 1 ? "متاح" : status === 2 ? "غير متاح" : status === 3 ? "قيد المعاينة" : status === 4 ? "لم يتم المعاينة بعد" : "غير معروف";
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
        {homesList.map((home, id) => (
          <div
            key={home.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  عقار #{id}
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
                  <p className="text-gray-900">{getCitiesByGovernorateId(home.governorate)}</p>
                </div>
              </div>


              <div>
                <p className="text-gray-900 font-medium">{home.city} - {home.street}</p>
              </div>
            </div>

            {/* Action Button */}
            {
              home.status === 4 ? (
                <div className="flex flex-row gap-2" >
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                    عرض التفاصيل
                  </button>
                  <button
                    onClick={() => handleInspectModal(home)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                    طلب معاينة
                    <MapPin className="inline-block mr-2" />
                  </button>
                </div>
              ) : (
                  <button
                    onClick={() => handleInspectModal(home)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  طلب معاينة
                  <MapPin className="inline-block mr-2" />
                </button>
              )
            }
          </div>
        ))}
      </div>


      {
        inspectModalOpen && (<InspectModal
          closeModal={() => {
            setInspectModalOpen(false);
            setSelectedHome(null);
          }}
          home={selectedHome}
        />)
      }


      
    </div>
  );
};

export default HomesGrid;