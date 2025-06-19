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
} from "lucide-react";

const SecurityTab = ({ userData, showSuccess }) => {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800 pb-2 border-b border-gray-200">
          <Lock className="h-5 w-5 text-indigo-600" />
          <span>الأمان والخصوصية</span>
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl flex-shrink-0">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg text-gray-800 mb-1">
                  تغيير كلمة المرور
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  يمكنك تغيير كلمة المرور الخاصة بك لحماية حسابك. نوصي بتغيير
                  كلمة المرور كل 90 يومًا.
                </p>
                <button
                  onClick={
                    () => {
                      window.location.href = "/forgot-password";
                    }
                  }
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl flex-shrink-0">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg text-gray-800 mb-1">
                  التحقق من الهوية
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  قم بتأكيد هويتك للحصول على علامة التحقق وتعزيز أمان حسابك
                  وزيادة الثقة في حسابك.
                </p>
                <button
                  onClick={
                  () => {
                    window.location.href = "/profile?tab=identity";
                        }
                  }
                  className={
                    userData?.verificationStatus === "تم التحقق"
                      ? "bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg flex items-center gap-2 cursor-default"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200"
                  }
                >
                  {userData?.verificationStatus === "تم التحقق" ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>تم التحقق</span>
                    </>
                  ) : (
                    "التحقق من الهوية"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-amber-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-xl flex-shrink-0">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg text-gray-800 mb-1">
                  استعادة كلمة المرور
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  في حالة نسيان كلمة المرور، يمكنك طلب رابط لإعادة تعيينها عبر
                  البريد الإلكتروني المسجل.
                </p>
                <button
                  onClick={showSuccess}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>استعادة كلمة المرور</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityTab;
