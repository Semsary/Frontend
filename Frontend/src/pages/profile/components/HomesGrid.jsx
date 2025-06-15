import React, { use, useEffect, useState } from 'react';
import { MapPin, Building2, MoreVertical, Loader, ImageUp } from 'lucide-react';
import { getAllGovernorates } from 'egylist'
import useHouseStore from '../../../store/house.store';
import InspectModal from './InspectModal';
import ViewHouseDataModal from './ViewHouseDataModal';

const HomesGrid = ({ trigger }) => {

  const { getHouses } = useHouseStore();
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [viewDataModalOpen, setViewDataModalOpen] = useState(false);
  const [selectedHome, setSelectedHome] = useState(null);
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [homesList, setHomesList] = useState([]);
  const Cities = getAllGovernorates();

  const getCitiesByGovernorateId = (governorateId) => {
    const city = Cities.find(city => city.id == governorateId);
    return city ? city.name_ar : "غير معروف";
  }

  const fetchHouses = async () => {
    const houses = await getHouses();
    console.table(houses);
    setHomesList(houses);
  };
  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    fetchHouses();
  }, [trigger]);


  const handleInspectModal = (home) => {
    setSelectedHome(home);
    setInspectModalOpen(true);
  };

  const handleViewDataModal = (home) => {
    setSelectedHouseId(home.houseId);    
    setViewDataModalOpen(true);
  };


  // useEffect(() => {
  //   fetchHouses();    
  // }, [viewDataModalOpen, inspectModalOpen]);

  const getStatusText = (status) => {
    if (status === 0) {
      return "جديد (لم يتم المعاينة بعد)";
    } if (status === 1) {
      return "تم ارسال طلب المعاينة";
    } else if (status === 2) {
      return "قيد التنفيذ";
    } else if (status === 3) {
      return "تمت اضافة البيانات";
    } else if (status === 4) {
      return "تم الانتهاء";
    } else {
      return "غير معروف";
    }
  };
  const getStatusColor = (status) => {
    if (status === 0) {
      return "bg-yellow-100 text-yellow-800";
    } else if (status === 1) {
      return "bg-blue-100 text-blue-800";
    } else if (status === 2) {
      return "bg-orange-100 text-orange-800";
    } else if (status === 3) {
      return "bg-green-100 text-green-800";
    } else if (status === 4) {
      return "bg-gray-100 text-gray-800";
    } else {
      return "bg-gray-200 text-gray-600";
    }
  }

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
            key={id}
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
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(home.status)}`}
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
              home.status === 2 ? (
                // <div className="flex flex-row gap-2" >
                //   <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                //     عرض التفاصيل
                //   </button>
                //   <button
                //     onClick={() => handleInspectModal(home)}
                //     className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                //     طلب معاينة
                //     <MapPin className="inline-block mr-2" />
                //   </button>
                // </div>
                <button
                  disabled={true}
                  className="w-full mt-4 bg-blue-400  hover:bg-blue-300 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  جاري التنفيذ
                  <ImageUp className="inline-block mr-2" />
                </button>

              ) : home.status === 0 ? (
                <button
                  onClick={() => {
                    handleInspectModal(home);


                  }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  طلب معاينة
                  <MapPin className="inline-block mr-2" />
                </button>
              ) : home.status === 1 ? (
                <button
                  disabled={true}
                  className="w-full mt-4 bg-blue-400  hover:bg-blue-300 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  الطلب قيد الانتظار
                  <ImageUp className="inline-block mr-2" />
                </button>
              ) : home.status === 3 ? (
                <button
                        onClick={() => {
                          handleViewDataModal(home)
                          // console.log(home);
                  }}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  عرض بيانات العقار
                </button>
              ) : home.status === 4 ? (
                <button className="w-full mt-4 bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed">
                  تم الانتهاء
                </button>
              ) : (
                <button className="w-full mt-4 bg-gray-300 text-gray-600 py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed">
                  حالة غير معروفة
                </button>
              )
            }
          </div>
        ))}
        {
          homesList.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                لا توجد عقارات لعرضها
              </div>
            </div>
          )}

      </div>


      {
        inspectModalOpen && (<InspectModal
          closeModal={() => {
            setInspectModalOpen(false);
            setSelectedHome(null);
          }}
          fetchHouses={fetchHouses}
          home={selectedHome}
        />)
      }

      {
        viewDataModalOpen && (
          <ViewHouseDataModal
            closeModal={() => {
              setViewDataModalOpen(false);
              setSelectedHouseId(null);
              
            }}
            fetchHouses={fetchHouses}
            houseId={selectedHouseId}
          />
        )
      }

    </div>
  );
};

export default HomesGrid;