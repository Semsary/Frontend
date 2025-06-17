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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center space-x-4 border-[1px] px-3 py-2 rounded-full shadow-xs">
        <div className="animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Not logged in - show login button
  if (!isLoggedIn()) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
      >
        <LogIn size={18} />
        <span>تسجيل الدخول</span>
      </button>
    );
  }

  // Logged in - show user profile dropdown
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="flex items-center space-x-4 border-[1px] px-1 pr-5 py-1 rounded-full shadow-xs hover:shadow-md transition-shadow">
            <img
              src={user?.picture || "../../../public/images/test/avatar.png"}
              alt="صورة المستخدم"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <AlignJustify size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-right w-64 z-50">
          <DropdownMenuLabel>
            <div className="flex items-center space-x-3">
              <img
                src={user?.picture || "../../../public/images/test/avatar.png"}
                alt="صورة المستخدم"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
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
            dir="rtl" className="text-right ">
            الملف الشخصي
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => window.location.href = "/notifications"}
            dir="rtl" className="text-right flex items-center justify-between">
            <span>الإشعارات</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem dir="rtl" className="text-right">الفواتير</DropdownMenuItem>
          <DropdownMenuItem dir="rtl" className="text-right">الفريق</DropdownMenuItem>
          <DropdownMenuItem dir="rtl" className="text-right">الاشتراك</DropdownMenuItem>

          {user?.balance !== undefined && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem dir="rtl" className="text-right">
                الرصيد: {user.balance} ر.س
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            dir="rtl"
            className="text-right text-red-600 hover:text-red-700 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={16} className="ml-2" />
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
