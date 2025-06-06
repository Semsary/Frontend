import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../config/api/axiosInstance";
import { Verified } from "lucide-react";

/**
 *  User Store to manage user Profile Data
 *  handel User Data GET - SET
*/

const useProfileStore = create(
  persist(
    (set, get) => ({    
      user: null, 
      loading: false,
      error: null,
      loadUserFromToken: async () => {
        set({ loading: true, error: null });
        try {
          const response1 = await axiosInstance.get("/Auth/GetUserInfo");
          const userData = {
            firstName: response1.data.firstname,
            lastName: response1.data.lastname,
            username: response1.data.username,
            email: response1.data.emails[0].email,
            picture: `https://avatar.iran.liara.run/public/boy?username=` + response1.data.username,
            Verified: response1.data.emails[0].isVerified,
          }

          set({ user: userData, loading: false });
          return response1.data;
        } catch (err) {
          set({
            error: "فشل تحميل بيانات المستخدم",
            loading: false,
          });
        }
      },


    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useProfileStore;
