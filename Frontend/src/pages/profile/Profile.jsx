import { useEffect, useState } from "react";
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

import ProfileTab from "./tabs/ProfileTab";
import HomesTabs from "./tabs/HomesTabs";
import SecurityTab from "./tabs/Security";
import SettingsTab from "./tabs/Settings";
import IdentityVerification from "./tabs/IdentityVerification";
import AddHomeTab from "./tabs/AddHomeTab";


import useProfileStore from "../../store/profile.store";
import { toast } from "sonner";
import useNotificationStore from "../../store/notification.store";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showNotification, setShowNotification] = useState(false);
  const { loadUserFromToken, user } = useProfileStore()
  const { allNotifications } = useNotificationStore()

  const [userData, setUserData] = useState(
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      image: "/placeholder-avatar.jpg",
      accountStatus: "نشط",
      verificationStatus: "تم التحقق",
      memberSince: "2023",
      completionRate: 85,
    }
  );


  useEffect(() => {
    if (true) {
       allNotifications()
    }
  }, []);



  useEffect(() => {
    loadUserFromToken();
    console.log("User data loaded:", user);

    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "01000000000",
        address: user.address || "غير محدد",
        image: user.picture || "/placeholder-avatar.jpg",
        accountStatus: user.accountStatus || "نشط",
        verificationStatus: user.verificationStatus || "تم التحقق",
        memberSince: user.memberSince || "2023",
        completionRate: user.completionRate || 85,
      });
    }
  }, [loadUserFromToken]);

  

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
                    onClick={() => setActiveTab("addHome")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${
                      activeTab === "addHome"
                        ? "bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                  >
                    <span className="flex items-center gap-3">
                      <Plus className="h-5 w-5" />
                      <span>إضافة عقار</span>
                    </span>
                    {activeTab === "addHome" && (
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
                    onClick={() => setActiveTab("identity")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${
                      activeTab === "identity"
                        ? "bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <span className="flex items-center gap-3">
                      <Shield className="h-5 w-5" />
                      <span>التحقق من الهوية</span>
                    </span>
                    {activeTab === "identity" && (
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
            {activeTab === "profile" && <ProfileTab userData={userData} />}
            {activeTab === "homes" && (
              <HomesTabs homesList={homesList} setHomesList={setHomesList}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "security" && (
              <SecurityTab
                userData={userData}
                showSuccess={showSuccess}
                setShowNotification={setShowNotification}
              />
            )}

            {activeTab === "settings" && <SettingsTab />}

            {activeTab === "identity" && (
              <IdentityVerification
                userData={userData}
                showSuccess={showSuccess}
              />
            )}
            
            {activeTab === "addHome" && (
              <AddHomeTab
                homesList={homesList}
                setHomesList={setHomesList}
                showSuccess={showSuccess}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
