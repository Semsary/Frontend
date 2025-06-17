import React, { useEffect, useState } from "react";
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
  Wallet,
  XCircle,
} from "lucide-react";
import useProfileStore from "../../../store/profile.store";

const ProfileTab = ({ setActiveTab }) => {
  const [userData, setUserData] = useState();
  const { loadUserFromToken } = useProfileStore();

  const handleChangeTab = (tab) => {
    console.log("Changing to tab:", tab);
    setActiveTab(tab);
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await loadUserFromToken();
        console.log("User Data:", user);
        setUserData(user);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    fetchUserData();

  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <span>المعلومات الشخصية</span>
          </h2>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>آخر تحديث: اليوم</span>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="group space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الاسم الأول
            </label>
            <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-800 group-hover:shadow-md transition-all duration-200">
              <User className="h-4 w-4 text-gray-400 mr-3" />
              <span className="font-medium">{userData?.firstName}</span>
            </div>
          </div>

          <div className="group space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الاسم الأخير
            </label>
            <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-800 group-hover:shadow-md transition-all duration-200">
              <User className="h-4 w-4 text-gray-400 mr-3" />
              <span className="font-medium">{userData?.lastName}</span>
            </div>
          </div>

          <div className="group space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
               <span>البريد الإلكتروني</span>
            </label>
            <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-800 group-hover:shadow-md transition-all duration-200">
              <span className="font-medium">{userData?.email}</span>
            </div>
          </div>

          <div className="group space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
               <span>العنوان</span>
            </label>
            <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-800 group-hover:shadow-md transition-all duration-200">
              <span className="font-medium">{userData?.fullAddress}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Account Type Card */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:border-indigo-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">نوع الحساب</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData?.isPremium ? 'مميز' : 'عادي'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-3 border border-indigo-200">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">
                    {userData?.isPremium ? '🌟' : '⭐'}
                  </span>
                  <span className="text-sm font-semibold text-indigo-700">
                    {userData?.isPremium ? 'حساب مميز' : 'حساب عادي'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className={`group relative bg-white rounded-2xl p-6 shadow-lg border transition-all duration-500 hover:shadow-2xl overflow-hidden ${userData?.verified
              ? 'border-emerald-100 hover:border-emerald-200'
              : 'border-red-100 hover:border-red-200'
            }`}>
            <div className={`absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-500 ${userData?.verified
                ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50'
                : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50'
              }`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${userData?.verified
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : 'bg-gradient-to-br from-red-500 to-rose-600'
                    }`}>
                    {userData?.verified ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <XCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">حالة التحقق</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData?.verified ? 'محقق' : 'غير محقق'}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`rounded-xl p-3 border ${userData?.verified
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-200'
                  : 'bg-gradient-to-r from-red-100 to-rose-100 border-red-200'
                }`}>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">
                    {userData?.verified ? '✅' : '❌'}
                  </span>
                  <span className={`text-sm font-semibold ${userData?.verified ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                    {userData?.verified ? 'تم التحقق' : 'يحتاج تحقق'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-2xl transition-all duration-500 hover:border-green-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">الرصيد الحالي</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData?.otherData?.balance || 0}
                      <span className="text-lg font-medium text-gray-600 mr-1">ج.م</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span className="text-sm font-semibold text-green-700">متاح للاستخدام</span>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={() => handleChangeTab("identity")}
            className="group bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Shield className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">تحقق من الهوية</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleChangeTab("profileData")}
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <Edit className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">تحديث المعلومات</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileTab;
