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

const HomesTabs = ({ homesList }) => {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-800">
            <Home className="h-5 w-5 text-indigo-600" />
            <span>قائمة العقارات</span>
          </h2>
          <button
            // onClick={showSuccess}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-indigo-200"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة عقار</span>
          </button>
        </div>

        <div className="space-y-4">
          {homesList.map((home) => (
            <div
              key={home.id}
              className="bg-white p-4 rounded-xl transition-all hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow-md group"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden">
                  <img
                    src={home.image}
                    alt={home.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg text-gray-800">
                      {home.title}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {home.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        home.status === "متاح"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {home.status}
                    </span>
                    <button
                      //   onClick={showSuccess}
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

        {/* Stats Panel */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
          <h3 className="text-lg font-medium mb-4 text-indigo-800 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-600" />
            <span>إحصائيات العقارات</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-indigo-600">2</span>
              <span className="text-gray-600">إجمالي العقارات</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-emerald-600">1</span>
              <span className="text-gray-600">متاح</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-amber-600">1</span>
              <span className="text-gray-600">قيد الإنشاء</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomesTabs
