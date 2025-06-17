import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../config/api/axiosInstance";
import { Verified } from "lucide-react";

/**
 *  User Store to manage user Profile Data
 *  handel User Data GET - SET
 */

const useProfileStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  loadUserFromToken: async () => {
    set({ loading: true, error: null });
    try {
      const response1 = await axiosInstance.get("/Auth/Auth/Me");

      const { basicUserInfo, otherLanlordData, otherTenantData } =
        response1.data;

      const {
        firstname,
        profileImageUrl,
        lastname,
        address,
        emails,
        userType,
        username,
      } = basicUserInfo;

      const baseUserData = {
        firstName: firstname,
        lastName: lastname,
        fullAddress: address
          ? address?._city + " - " + address?.street
          : " بدون عنوان",
        address,
        email: emails[0],
        userType,
        username: username || emails[0],
        picture:
          profileImageUrl ||
          `https://avatar.iran.liara.run/public/boy?username=${emails[0]}`,
      };

      const userTypeConfigs = {
        2: {
          // Landlord
          balance: otherLanlordData?.balance,
          verified: otherLanlordData?.isVerified,
          isPremium: otherLanlordData?.isPremium || false,
        },
        1: {
          // Tenant
          verified: otherTenantData?.isVerified,
          isPremium: otherTenantData?.isPremium || false,
          otherData: {
            height: otherTenantData?.height || null,
            age: otherTenantData?.age || null,
            balance: otherTenantData?.balance || 0,
            gender: otherTenantData?.gender || null,
            weight: otherTenantData?.weight || null,
            isSmoker: otherTenantData?.isSmoker || false,
            needNearUniversity: otherTenantData?.needNearUniversity || false,
            needNearVitalPlaces: otherTenantData?.needNearVitalPlaces || false,
            needPublicTransportation:
              otherTenantData?.needPublicTransportation || false,
            needPublicService: otherTenantData?.needPublicService || false,
          },
        },
        3: {}, // Customer Service
      };

      const userData = {
        ...baseUserData,
        ...userTypeConfigs[userType],
      };

      // console.log("User Data: store baseUserData", baseUserData);
      // console.log("User Data: store userTypeConfigs", userData);
      set({
        user: userData,
        loading: false,
      });
      return userData;
    } catch (err) {
      console.error("Error loading user data:", err);
      set({
        error: "فشل تحميل بيانات المستخدم",
        loading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });

    try {
      const isFormData = data instanceof FormData;
      const response = await axiosInstance.put("/Auth/Edit/Profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data;

      // Merge updated data with existing user data
      const currentUser = get().user;
      const mergedUser = {
        ...currentUser,
      };

      set({
        user: mergedUser,
        loading: false,
      });

      // console.log("Updated User response:", response);
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      set({
        error: "فشل تحديث الملف الشخصي",
        loading: false,
      });
      throw error;
    }
  },

  isLoggedIn: () => {
    const user = get().user;
    return user !== null && user !== undefined;
  },

  logout: () => {
    set({ user: null, error: null });
    localStorage.removeItem("token");
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("user-storage");
  },
}));

export default useProfileStore;
