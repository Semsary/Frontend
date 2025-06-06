import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../config/api/axiosInstance";
import { Verified } from "lucide-react";

/**
 *  House Store
 *  
 */

const useHouseStore = create(
  persist(
    (set, get) => ({
      houses: [],
      loading: false,
      error: null,

      createHouse: async (houseData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post(
            "/LandLord/create/house",
            houseData
          );
          set({ loading: false });
          return response.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "حدث خطأ أثناء إنشاء المنزل",
            loading: false,
          });
          return null;
        }
      },
    }),
    {
      name: "house-storage",
      partialize: (state) => ({}),
    }
  )
);

export default useHouseStore;
