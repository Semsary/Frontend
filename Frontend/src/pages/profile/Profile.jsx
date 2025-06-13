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
  MessageCircle,
  MailIcon,
  Menu,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import ProfileTab from "./tabs/ProfileTab";
import HomesTabs from "./tabs/HomesTabs";
import SecurityTab from "./tabs/Security";
import SettingsTab from "./tabs/Settings";
import IdentityVerification from "./tabs/IdentityVerification";
import AddHomeTab from "./tabs/AddHomeTab";
import ChatPage from "./tabs/ChatPage";
import ProfileData from "./tabs/ProfileData";

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
        accountStatus: user.verified || "نشط",
        verificationStatus: user.verified ,
        memberSince: user.memberSince || "2023",
        completionRate: user.completionRate || 85,
        balance: user.balance || 0,
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-1">
        <div className="max-w- 7xl  mx-auto px-32">
          <div className="flex h-16 items-center justify-between">

            {/* Left Section - Logo/Branding */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h1 className="mr-3 text-lg font-semibold text-gray-900">الملف الشخصي</h1>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center gap-4">

              {/* Notification Button */}
              <button
                onClick={() => setShowNotification(!showNotification)}
                className="relative rounded-full p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Bell className="h-6 w-6 text-gray-700" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {/* User Profile */}
       
              {/* Logout Button - Desktop */}
              <button className="hidden md:flex items-center space-x-1.5 rtl:space-x-reverse ml-4 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </button>

              {/* Mobile Menu Button */}
              <button className="md:hidden rounded-md p-1.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Menu className="h-6 w-6" />
              </button>
            </div>
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
                  <MailIcon className="h-3 w-3" />
                  {userData.email}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className={` text-xs px-2 py-1 rounded-full flex items-center gap-1
                      ${
                    userData.verificationStatus? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }
                    `}>
                    <CheckCircle className="w-3 h-3" />
                    {userData.verificationStatus? "تم التحقق" : "غير موثق"}
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
                    onClick={() => setActiveTab("chat")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${
                      activeTab === "chat"
                        ? "bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                  >
                    <span className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5" />
                      <span>الدردشة</span>
                    </span>
                    {activeTab === "chat" && (
                      <ChevronLeft className="h-5 w-5" />
                    )}
                  </button>
                </li>



                <li>
                  <button
                    onClick={() => setActiveTab("profileData")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${
                      activeTab === "profileData"
                        ? "bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <span>بيانات الملف الشخصي</span>
                    </span>
                    {activeTab === "profileData" && (
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

            {activeTab === "profileData" && (
              <ProfileData
                userData={userData}
                showSuccess={showSuccess}
              />
            )}


            {activeTab === "chat" && <ChatPage />}
          </div>
        </div>
      </main>
    </div>
  );
}
