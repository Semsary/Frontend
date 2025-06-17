import React from "react";
import { Bell, X, Clock } from "lucide-react";

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
    const { id, title, message, createdAt, isRead } = notification;

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return "منذ لحظات";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `منذ ${minutes} دقيقة`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `منذ ${hours} ساعة`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `منذ ${days} يوم`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `منذ ${months} شهر`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `منذ ${years} سنة`;
        }
    };

    const timeAgo = getTimeAgo(createdAt);

    const handleMarkAsRead = () => {
        if (!isRead) {
            onMarkAsRead(id);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(id);
    };

    return (
        <div
            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${!isRead ? "border-blue-200 bg-blue-50" : "border-gray-200"
                }`}
            onClick={handleMarkAsRead}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-full ${!isRead ? "bg-blue-100" : "bg-gray-100"}`}>
                        <Bell size={16} className={!isRead ? "text-blue-600" : "text-gray-600"} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className={`text-sm font-medium text-right ${!isRead ? "text-blue-900" : "text-gray-900"}`}>
                                {title}
                            </h3>
                            {!isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mt-1 text-right whitespace-pre-line">
                            {message}
                        </p>

                        <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock size={12} className="ml-1" />
                            <span>{timeAgo}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default NotificationCard;
