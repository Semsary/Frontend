import React, { useEffect, useState } from 'react'
import {
  User,
  Home,
  Lock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ChevronLeft,
  LogOut,
  Settings,
  Bell,
  Calendar,
  Shield,
  PieChart,
  Award,
  ArrowRight,
  FileText,
  Edit,
  Plus,
  Eye,
  ChevronRight,
} from "lucide-react";
import useHouseStore from '../../../store/house.store';
import CreateAdModal from '../components/CreateAdModal';
import { Link } from 'react-router-dom';

const HomesTabs = ({ setActiveTab }) => {

  const { loading, getApprovedHouses } = useHouseStore();

  const [homesList, setHomesList] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;


  const fetchHouses = async () => {
    try {
      const houses = await getApprovedHouses();
      setHomesList(houses);
    } catch (error) {
      console.error("Error fetching houses:", error);
    }

  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleShowDetails = (house) => {
    const id = house?.lastApprovedInspection?.houseId;
    setSelectedHouse(house);

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHouse(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(homesList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHomes = homesList.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-800">
            <Home className="h-5 w-5 text-indigo-600" />
            <span>قائمة العقارات</span>
            {homesList.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({homesList.length} عقار)
              </span>
            )}
          </h2>
          <button
            onClick={
              () => setActiveTab("addHome")
            }
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-indigo-200"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة عقار</span>
          </button>
        </div>

        <div className="space-y-4">
          {currentHomes.map((home, id) => (
            <div
              key={id}
              className="bg-white p-4 rounded-xl transition-all hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow-md group"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden">
                  <img
                    src={home?.lastApprovedInspection?.houseImages?.[0] || "https://via.placeholder.com/150"}
                    alt={home.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg text-gray-800">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      {home.house.city} - {home.house.street}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <span className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        <span className="text-gray-600 flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded-md">
                          <User className="h-3 w-3 text-blue-500" />
                          {home.lastApprovedInspection?.numberOfBedRooms || 0} غرف نوم
                        </span>
                        <span className="text-gray-600 flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded-md">
                          <Home className="h-3 w-3 text-teal-500" />
                          {home.lastApprovedInspection?.numberOfPathRooms || 0} حمامات
                        </span>
                        <span className="text-gray-600 flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded-md">
                          <Calendar className="h-3 w-3 text-purple-500" />
                          {home.lastApprovedInspection?.numberOfBeds || 0} أسرة
                        </span>
                        <span className="text-gray-600 flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded-md">
                          <Settings className="h-3 w-3 text-cyan-500" />
                          {home.lastApprovedInspection?.numberOfAirConditionnar || 0} مكيفات
                        </span>
                        <span className="text-gray-600 flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded-md">
                          <Shield className="h-3 w-3 text-green-500" />
                          {home.lastApprovedInspection?.numberOfPathRooms || 0} غرف
                        </span>
                        <span className="text-gray-600 flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded-md">
                          <Award className="h-3 w-3 text-orange-500" />
                          {home.lastApprovedInspection?.numberOfBalacons || 0} شرفات
                        </span>
                        <span className="text-gray-600 flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded-md">
                          <CheckCircle className="h-3 w-3 text-amber-500" />
                          {home.lastApprovedInspection?.numberOfTables || 0} طاولات
                        </span>
                        <span className="text-gray-600 flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded-md">
                          <Bell className="h-3 w-3 text-pink-500" />
                          {home.lastApprovedInspection?.numberOfChairs || 0} كراسي
                        </span>
                      </span>
                    </p>

                  </div>
                  <div className="flex items-center gap-3 justify-between md:justify-end mt-4">

                    {home.house.hasPublishedAdv ? (
                      <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-green-100 text-green-800 border border-green-300 shadow-sm cursor-default select-none">
                        <Eye className="h-5 w-5 text-green-600" />
                        <span className="text-sm sm:text-base font-medium">
                          تم نشر إعلان لهذا المنزل
                        </span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleShowDetails(home)}
                        className="group flex items-center gap-3 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                      >
                        <Eye className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-base tracking-wide">نشر إعلان</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    )}


                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                }`}
            >
              <ChevronRight className="h-4 w-4" />
              <span>السابق</span>
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-2 rounded-lg transition-all ${currentPage === index + 1
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                }`}
            >
              <span>التالي</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Show message when no homes */}
        {homesList.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <Home className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد عقارات لعرضها</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedHouse && (
        <CreateAdModal
          closeModal={closeModal}
          houseData={selectedHouse}
          mode="rental"

        />
      )}
    </>
  );
};

export default HomesTabs
