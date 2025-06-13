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
          const response1 = await axiosInstance.get("/Auth/Auth/Me");

          const {
            basicUserInfo,
            profileImageUrl,
            otherLanlordData,
            otherTenantData,
          } = response1.data;
          const { firstname, lastname, address, emails, userType } =
            basicUserInfo;

          const baseUserData = {
            firstName: firstname,
            lastName: lastname,
            address,
            email: emails[0],
            userType,
            picture:
              profileImageUrl ||
              `https://avatar.iran.liara.run/public/boy?username=${emails[0]}`,
          };


          const userTypeConfigs = {
            2: {
              // Landlord
              balance: otherLanlordData?.balance,
              verified: otherLanlordData?.isVerified,
            },
            1: {
              // Tenant
              verified: otherTenantData?.isVerified,
              otherData: {
                height: otherTenantData?.height || null,
                age: otherTenantData?.age || null,
                balance: otherTenantData?.balance || 0,
                gender: otherTenantData?.gender || null,
                isSmoker: otherTenantData?.isSmoker || false,
                needNearUniversity:
                  otherTenantData?.needNearUniversity || false,
                needNearVitalPlaces:
                  otherTenantData?.needNearVitalPlaces || false,
                needPublicTransportation:
                  otherTenantData?.needPublicTransportation || false,
                needPublicService: otherTenantData?.needPublicService || false,

              },
            },
            3: {}, // Customer Service
          };

          const userData = userTypeConfigs[userType]
            ? { ...baseUserData, ...userTypeConfigs[userType] }
            : null;

          set({
            user: userData,
            loading: false,
          });


          set({ user: userData, loading: false });
          return userData;
        } catch (err) {
          set({
            error: "فشل تحميل بيانات المستخدم",
            loading: false,
          });
        }
      },



      updateProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put("/Auth/Edit/Profile", data,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const updatedUser = response.data;
          set({
            user: {
              ...get().user,
              ...updatedUser,
            },
            loading: false,
          });

          console.log("Update dfd User:", response);
          return updatedUser;
        } catch (error) {
          console.error("Error updating profile:", error);
          set({
            error: "فشل تحديث الملف الشخصي",
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
