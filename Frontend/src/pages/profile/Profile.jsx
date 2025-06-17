import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import useNotificationStore from "../../store/notification.store";
import Navbar from "../../components/navbar/Navbar";

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial tab from URL or default to "profile"
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || "profile";
  });

  const [showNotification, setShowNotification] = useState(false);
  const [userData, setUserData] = useState();
  const { loadUserFromToken } = useProfileStore();
  const { allNotifications } = useNotificationStore()

  const handleChangeTab = (tab) => {
    console.log("Changing to tab:", tab);
    setActiveTab(tab);
  };

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

  useEffect(() => {
    allNotifications()
  }, [allNotifications]);

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

  const showSuccess = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Function to handle tab changes and update URL
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);



  return (
    <div
      
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

      <div dir="ltr ">

        <Navbar searchBar={false} />
      </div>
      {/* Header */}

      <main className="container mx-auto p-4 md:p-6" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 p-1 relative">
                    <img
                      src={userData?.picture
                        || "/placeholder-avatar.jpg"}
                      alt="صورة الملف الشخصي"
                      className="w-full h-full rounded-full object-cover"
                    />

                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{`${userData?.firstName || ""} ${userData?.lastName || ""}`}</h2>
                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                  <MailIcon className="h-3 w-3" />
                  {userData?.email || ""}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className={` text-xs px-2 py-1 rounded-full flex items-center gap-1
                      ${userData?.verified ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }
                    `}>
                    <CheckCircle className="w-3 h-3" />
                    {userData?.verified ? "تم التحقق" : "غير موثق"}
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
                    onClick={() => handleTabChange("profile")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${activeTab === "profile"
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
                    onClick={() => handleTabChange("homes")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${activeTab === "homes"
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

                
                {
                  userData?.userType === 2 && (
                
                    <li>
                      <button
                        onClick={() => handleTabChange("addHome")}
                        className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${activeTab === "addHome"
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
                    </li>)}

                <li>
                  <button
                    onClick={() => handleTabChange("chat")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${activeTab === "chat"
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
                    onClick={() => handleTabChange("profileData")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${activeTab === "profileData"
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
                    onClick={() => handleTabChange("security")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${activeTab === "security"
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
                    onClick={() => handleTabChange("identity")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${activeTab === "identity"
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
                    onClick={() => handleTabChange("settings")}
                    className={`w-full text-right py-3.5 px-4 flex items-center justify-between ${activeTab === "settings"
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
          </div>          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && <ProfileTab setActiveTab={handleChangeTab}
              userData={userData} />}
            {activeTab === "homes" && (
              <HomesTabs
                setActiveTab={handleChangeTab}
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
                setActiveTab={handleChangeTab}
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