import { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showNotification, setShowNotification] = useState(false);
  const [homesList, setHomesList] = useState([
    {
      id: 1,
      title: "شقة في القاهرة",
      address: "وسط البلد، القاهرة",
      status: "متاح",
      image: "/placeholder-property.jpg",
    },
    {
      id: 2,
      title: "فيلا في الإسكندرية",
      address: "المنتزه، الإسكندرية",
      status: "قيد الإنشاء",
      image: "/placeholder-property-2.jpg",
    },
  ]);

  const showSuccess = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const userData = {
    firstName: "محمد",
    lastName: "أحمد",
    email: "mohamed.ahmed@example.com",
    phone: "01234567890",
    address: "شارع النصر، القاهرة، مصر",
    image: "/placeholder-avatar.jpg",
    accountStatus: "نشط",
    verificationStatus: "تم التحقق",
    memberSince: "2023",
    completionRate: 85,
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50"
    >
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <Alert className="bg-emerald-50 text-emerald-800 border border-emerald-200 w-80 shadow-lg">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>تم بنجاح</AlertTitle>
            <AlertDescription>تم حفظ التغييرات بنجاح!</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-indigo-800">
            <User className="h-6 w-6 text-indigo-600" />
            <span>الملف الشخصي</span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="p-2 rounded-full hover:bg-indigo-50 text-indigo-700 transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors shadow-md hover:shadow-indigo-200">
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline-block">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 p-1 relative">
                    <img
                      src={userData.image}
                      alt="صورة الملف الشخصي"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{`${userData.firstName} ${userData.lastName}`}</h2>
                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  عضو منذ {userData.memberSince}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {userData.verificationStatus}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full mb-4">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-gray-600">اكتمال الملف الشخصي</span>
                    <span className="font-bold text-indigo-700">
                      {userData.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${userData.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white w-full rounded-lg py-2 mb-2 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-indigo-200">
                  <Edit className="h-4 w-4" />
                  <span>تحديث الملف الشخصي</span>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <ul>
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${
                      activeTab === "profile"
                        ? "bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <span className="flex items-center gap-3">
                      <User className="h-5 w-5" />
                      <span>المعلومات الشخصية</span>
                    </span>
                    {activeTab === "profile" && (
                      <ChevronLeft className="h-5 w-5" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("homes")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${
                      activeTab === "homes"
                        ? "bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <span className="flex items-center gap-3">
                      <Home className="h-5 w-5" />
                      <span>قائمة العقارات</span>
                    </span>
                    {activeTab === "homes" && (
                      <ChevronLeft className="h-5 w-5" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${
                      activeTab === "security"
                        ? "bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <span className="flex items-center gap-3">
                      <Lock className="h-5 w-5" />
                      <span>الأمان والخصوصية</span>
                    </span>
                    {activeTab === "security" && (
                      <ChevronLeft className="h-5 w-5" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${
                      activeTab === "settings"
                        ? "bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <span className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      <span>الإعدادات</span>
                    </span>
                    {activeTab === "settings" && (
                      <ChevronLeft className="h-5 w-5" />
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
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
                        <h3 className="font-medium text-gray-600 mb-1">
                          حالة الحساب
                        </h3>
                        <p className="text-indigo-700 font-bold">
                          {userData.accountStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 p-3 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-600 mb-1">
                          حالة التحقق
                        </h3>
                        <p className="text-emerald-700 font-bold">
                          {userData.verificationStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 p-3 rounded-xl">
                        <Award className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-600 mb-1">
                          عضوية
                        </h3>
                        <p className="text-amber-700 font-bold">بريميوم</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={showSuccess}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>تحقق من الهوية</span>
                  </button>
                  <button
                    onClick={showSuccess}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>تحديث المعلومات</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "homes" && (
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-800">
                    <Home className="h-5 w-5 text-indigo-600" />
                    <span>قائمة العقارات</span>
                  </h2>
                  <button
                    onClick={showSuccess}
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
                              onClick={showSuccess}
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
                      <span className="text-3xl font-bold text-indigo-600">
                        2
                      </span>
                      <span className="text-gray-600">إجمالي العقارات</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center">
                      <span className="text-3xl font-bold text-emerald-600">
                        1
                      </span>
                      <span className="text-gray-600">متاح</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center">
                      <span className="text-3xl font-bold text-amber-600">
                        1
                      </span>
                      <span className="text-gray-600">قيد الإنشاء</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
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
                          يمكنك تغيير كلمة المرور الخاصة بك لحماية حسابك. نوصي
                          بتغيير كلمة المرور كل 90 يومًا.
                        </p>
                        <button
                          onClick={showSuccess}
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
                          قم بتأكيد هويتك للحصول على علامة التحقق وتعزيز أمان
                          حسابك وزيادة الثقة في حسابك.
                        </p>
                        <button
                          onClick={showSuccess}
                          className={
                            userData.verificationStatus === "تم التحقق"
                              ? "bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg flex items-center gap-2 cursor-default"
                              : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200"
                          }
                        >
                          {userData.verificationStatus === "تم التحقق" ? (
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
                          في حالة نسيان كلمة المرور، يمكنك طلب رابط لإعادة
                          تعيينها عبر البريد الإلكتروني المسجل.
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
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800 pb-2 border-b border-gray-200">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  <span>الإعدادات</span>
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Bell className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">الإشعارات</h3>
                        <p className="text-sm text-gray-600">
                          تفعيل إشعارات التطبيق
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
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
                        <p className="text-sm text-gray-600">
                          تغيير لغة التطبيق
                        </p>
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
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
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
            )}
          </div>
        </div>
      </main>

  
    </div>
  );
}
