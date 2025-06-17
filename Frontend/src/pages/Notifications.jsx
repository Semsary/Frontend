import React, { useEffect } from "react";
import { Bell, Check, CheckCheck, ArrowRight } from "lucide-react";
import useNotificationsStore from "../store/notifications.store";
import NotificationCard from "../components/notifications/NotificationCard";
import Navbar from "../components/navbar/Navbar";

const Notifications = () => {
    const {
        notifications,
        loading,
        error,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotificationsStore();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleGoBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <>
                <Navbar searchBar={false} />
                <div className="min-h-screen bg-gray-50 p-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg p-6">
                            <div className="animate-pulse space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="border rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 p-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg p-6 text-center">
                            <div className="text-red-500 mb-4">
                                <Bell size={48} className="mx-auto" />
                            </div>
                            <h2 className="text-lg font-medium text-gray-900 mb-2">
                                خطأ في تحميل الإشعارات
                            </h2>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={fetchNotifications}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                إعادة المحاولة
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar searchBar={false} />
            <div className="min-h-screen bg-gray-50">
                

                {/* Content */}
                <div className="max-w-2xl mx-auto p-4">
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <div className="text-gray-400 mb-4">
                                <Bell size={48} className="mx-auto" />
                            </div>
                            <h2 className="text-lg font-medium text-gray-900 mb-2">
                                لا توجد إشعارات
                            </h2>
                            <p className="text-gray-600">
                                ستظهر إشعاراتك هنا عندما تتوفر
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={markAsRead}
                                    onDelete={deleteNotification}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Notifications;
