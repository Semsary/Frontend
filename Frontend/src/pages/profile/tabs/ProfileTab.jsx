import React from "react";
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

const ProfileTab = ({ userData }) => { 
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800 pb-2 border-b border-gray-200">
          <User className="h-5 w-5 text-indigo-600" />
          <span>المعلومات الشخصية</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              الاسم الأول
            </label>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800">
              {userData.firstName}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              الاسم الأخير
            </label>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800">
              {userData.lastName}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
              <Mail className="h-4 w-4 text-indigo-500" />
              <span>البريد الإلكتروني</span>
            </label>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800">
              {userData.email}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
              <Phone className="h-4 w-4 text-indigo-500" />
              <span>رقم الهاتف</span>
            </label>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800">
              {userData.phone}
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-indigo-500" />
              <span>العنوان</span>
            </label>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800">
              {userData.address}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-600 mb-1">حالة الحساب</h3>
                <p className="text-indigo-700 font-bold">
                  {userData.accountStatus}
                </p>
              </div>
            </div>
          </div>
      
          <div className={`${userData.verificationStatus
              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'
              : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'
            } rounded-xl p-4 border hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-4">
              <div className={`${userData.verificationStatus ? 'bg-emerald-100' : 'bg-red-100'
                } p-3 rounded-xl`}>
                {userData.verificationStatus ? (
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-600 mb-1">حالة التحقق</h3>
                <p className={`${userData.verificationStatus ? 'text-emerald-700' : 'text-red-700'
                  } font-bold`}>
                  {userData.verificationStatus ? 'محقق' : 'غير محقق'}
                </p>
              </div>
            </div>
          </div>


          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-600 mb-1">الرصيد</h3>
                <p className="text-green-700 font-bold text-lg">
                  {userData.balance } ج.م
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            // onClick={}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            <span>تحقق من الهوية</span>
          </button>
          <button
            // onClick={showSuccess}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span>تحديث المعلومات</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileTab;
