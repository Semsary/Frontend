// import { AlignJustify } from 'lucide-react';
import { AlignJustify, LogIn, LogOut, User } from "lucide-react";
import React, { useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import useProfileStore from "../../../store/profile.store";
import useAuthStore from "../../../store/auth.store";
import useNotificationsStore from "../../../store/notifications.store";

const Profile = () => {
  const { user, isLoggedIn, logout, loadUserFromToken, loading } = useProfileStore();
  const { unreadCount } = useNotificationsStore();

  // const { logout } = useAuthStore();  

  useEffect(() => {

    if (!user) {
      loadUserFromToken();
    }
  }, []);

  const handleLogin = () => {
    // Navigate to login page
    window.location.href = "/login";
  };

  const handleLogout = () => {
    // Clear user data and token
    logout();
  };

  // Loading state - Enhanced mobile sizing
  if (loading) {
    return (
      <div className="flex items-center space-x-2 sm:space-x-4 border-[1px] px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-xs">
        <div className="animate-pulse">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Not logged in - Enhanced mobile button
  if (!isLoggedIn()) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center space-x-1 sm:space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors text-xs sm:text-sm min-h-[32px] sm:min-h-[36px]"
      >
        <LogIn size={14} className="sm:w-[18px] sm:h-[18px]" />
        <span className="hidden sm:inline">تسجيل الدخول</span>
        <span className="sm:hidden">دخول</span>
      </button>
    );
  }

  // Logged in - Enhanced mobile dropdown
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2 sm:space-x-4 border-[1px] px-1 pr-2 sm:pr-5 py-1 rounded-full shadow-xs hover:shadow-md transition-shadow min-h-[36px] sm:min-h-[40px]">
            <img
              src={user?.picture || "../../../public/images/test/avatar.png"}
              alt="صورة المستخدم"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
            />
            <div className="text-right hidden lg:block">
              <p className="text-xs sm:text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <AlignJustify size={16} className="sm:w-5 sm:h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-right w-56 sm:w-64 z-50 mr-2 sm:mr-0">
          <DropdownMenuLabel>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img
                src={user?.picture || "../../../public/images/test/avatar.png"}
                alt="صورة المستخدم"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-blue-500">
                  {user?.userType === 1
                    ? "مستأجر"
                    : user?.userType === 2
                      ? "مالك"
                      : "خدمة العملاء"}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator dir="rtl" />

          <DropdownMenuItem
            onClick={() => window.location.href = "/profile"}
            dir="rtl"
            className="text-right text-sm sm:text-base py-2 sm:py-3">
            الملف الشخصي
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => window.location.href = "/notifications"}
            dir="rtl"
            className="text-right flex items-center justify-between text-sm sm:text-base py-2 sm:py-3">
            <span>الإشعارات</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem dir="rtl" className="text-right text-sm sm:text-base py-2 sm:py-3">الفواتير</DropdownMenuItem>
          <DropdownMenuItem dir="rtl" className="text-right text-sm sm:text-base py-2 sm:py-3">الفريق</DropdownMenuItem>
          <DropdownMenuItem dir="rtl" className="text-right text-sm sm:text-base py-2 sm:py-3">الاشتراك</DropdownMenuItem>

          {user?.balance !== undefined && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem dir="rtl" className="text-right text-sm sm:text-base py-2 sm:py-3">
                الرصيد: {user.balance} ر.س
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            dir="rtl"
            className="text-right text-red-600 hover:text-red-700 cursor-pointer text-sm sm:text-base py-2 sm:py-3"
            onClick={handleLogout}
          >
            <LogOut size={14} className="ml-1 sm:ml-2 sm:w-4 sm:h-4" />
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
