import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../config/api/axiosInstance";

/**
 *  Notification Store to manage user notifications
 *? handel FCM Token GET - SET 
 */


const useNotificationStore = create(
  persist(
    (set, get) => ({    
      FCMToken: null,
      user: null,

      setFCMToken: async (token) => {
        set({ FCMToken: token });
      },

      getFCMToken: async () => {
        const token = get().FCMToken;
        return token;
      },

      allNotifications: async () => {
        try {
          const response = await axiosInstance.post("/Auth/AllowNotifications", {
            deviceToken: get().FCMToken || "",
          }
          );
          // console.log("All notifications:", response);
          return response.data;
        } catch (err) {
          console.error("Error fetching all notifications:", err);
          throw err;
        }
      },

   

    }),
    {
      name: "notification-storage", 
      partialize: (state) => ({
        FCMToken: state.FCMToken,
      }),
    }
  )
);

export default useNotificationStore;
