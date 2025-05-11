import React from 'react'
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
  
const SettingsTab = (
    {showSuccess} // Assuming showSuccess is a function passed as a prop
) => {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
        {/* <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800 pb-2 border-b border-gray-200">
          <Settings className="h-5 w-5 text-indigo-600" />
          <span>الإعدادات</span>
        </h2> */}

        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">الإشعارات</h3>
                <p className="text-sm text-gray-600">تفعيل إشعارات التطبيق</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Lock className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  تفعيل المصادقة الثنائية
                </h3>
                <p className="text-sm text-gray-600">
                  زيادة مستوى الأمان لحسابك
                </p>
              </div>
            </div>
            <button
              onClick={showSuccess}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200"
            >
              تفعيل
            </button>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">اللغة</h3>
                <p className="text-sm text-gray-600">تغيير لغة التطبيق</p>
              </div>
            </div>
            <select className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  الإشعارات البريدية
                </h3>
                <p className="text-sm text-gray-600">
                  استلام تحديثات عبر البريد الإلكتروني
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <button
              onClick={showSuccess}
              className="text-red-500 hover:text-red-600 font-medium flex items-center gap-2 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>حذف الحساب</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsTab;
