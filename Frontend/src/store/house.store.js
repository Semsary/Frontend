import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../config/api/axiosInstance";
import { Verified } from "lucide-react";

/**
 *  House Store
 *
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
          const response = await axiosInstance.post(
            "/LandLord/create/house",
            data
          );
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

      getHouses: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get("/LandLord/Houses/GetAll");
          const NotInspectedHouses = response.data.notInspectedHouses || [];
          const InspectedHouses = response.data.inspectedHouses || [];
          const combinedHouses = NotInspectedHouses.map((house) => ({
            ...house,
            status: 0,
          })).concat(
            InspectedHouses.map((house) => ({
              ...house,
              status: house.lastInspectionStatus,
            }))
          );
          set({ houses: combinedHouses, loading: false, error: null });
          return combinedHouses;
        } catch (err) {
          console.error("Error fetching houses:", err);
          set({
            error: err.response?.data?.message || "حدث خطأ أثناء جلب المنازل",
            loading: false,
          });
          return [];
        }
      },

      createInspection: async (houseId) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post(
            "LandLord/inspection/request/" + houseId
          );
          set({ loading: false });
          
          return response.data;
        } catch (err) {
          console.error("Error creating inspection:", err);
          set({
            error:
              err.response?.data?.message || "حدث خطأ أثناء إنشاء المعاينة",
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
