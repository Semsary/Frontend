import { create } from "zustand";
import axiosInstance from "../config/api/axiosInstance";

const useNotificationsStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/Auth/User/Notifications");
      const notifications = response.data;

      // Calculate unread count (assuming we have a read status)
      const unreadCount = notifications.filter((n) => !n.isRead).length;

      set({
        notifications,
        unreadCount,
        loading: false,
      });

      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({
        error: "فشل تحميل الإشعارات",
        loading: false,
      });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);

      const notifications = get().notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );

      const unreadCount = notifications.filter((n) => !n.isRead).length;

      set({ notifications, unreadCount });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.put("/notifications/mark-all-read");

      const notifications = get().notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      set({ notifications, unreadCount: 0 });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);

      const notifications = get().notifications.filter(
        (notification) => notification.id !== notificationId
      );

      const unreadCount = notifications.filter((n) => !n.isRead).length;

      set({ notifications, unreadCount });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  },
}));

export default useNotificationsStore;
