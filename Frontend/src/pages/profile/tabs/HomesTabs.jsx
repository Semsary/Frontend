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
} from "lucide-react";
import useHouseStore from '../../../store/house.store';
import CreateAdModal from '../components/CreateAdModal';

const HomesTabs = ({ setActiveTab }) => {

  const { loading, getApprovedHouses } = useHouseStore();

  const [homesList, setHomesList] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showModal, setShowModal] = useState(false);


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

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-800">
            <Home className="h-5 w-5 text-indigo-600" />
            <span>قائمة العقارات</span>
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
          {homesList.map((home,id) => (
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

                    <button
                      onClick={() => handleShowDetails(home)}
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>عرض التفاصيل</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

     
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
