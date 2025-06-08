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
          const data = {
            address: {
              id: 0,
              _gover: Number(houseData.governorate),
              _city: houseData.city,
              street: houseData.location,
            },
          };
          const response = await axiosInstance.post("/LandLord/create/house", data) 
          console.log("House created successfully:", response);
          set({ loading: false });
          return true;
        } catch (err) {
          console.error("Error creating house:", err);
          set({
            error: err.response?.data?.message || "حدث خطأ أثناء إنشاء المنزل",
            loading: false,
          });
          return false;
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
