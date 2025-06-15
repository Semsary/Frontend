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
      houseDone: [],

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

      getHousesDone: async () => {
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
          // Filter out and return houses status 4 (completed)
          const completedHouses = combinedHouses.filter(
            (house) => house.status === 4
          );
          set({
            completedHouses: completedHouses,
            loading: false,
            error: null,
          });
          return completedHouses;
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

      getHouseInspectionData: async (houseId) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get(
            `LandLord/inspection/get/${houseId}`
          );
          set({ loading: false });
          console.log("House Inspection Data:", response);
          return response.data;
        } catch (err) {
          console.error("Error fetching house inspection data:", err);
          set({
            error:
              err.response?.data?.message ||
              "حدث خطأ أثناء جلب بيانات المعاينة",
            loading: false,
          });
          return null;
        }
      },

      acceptHouseInspection: async (houseId) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put(
            `/LandLord/inspection/approve/${houseId}`
          );
          set({ loading: false });
          return response.data;
        } catch (err) {
          console.error("Error accepting house inspection:", err);
          set({
            error: err.response?.data?.message || "حدث خطأ أثناء قبول المعاينة",
            loading: false,
          });
          return null;
        }
      },

      getApprovedHouses: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get(
            "/LandLord/get/all/approved/houses"
          );
          set({ loading: false, houses: response.data });
          console.log("Approved Houses:", response.data);
          
          return response.data;
        } catch (err) {
          console.error("Error fetching approved houses:", err);
          set({
            error:
              err.response?.data?.message || "حدث خطأ أثناء جلب المنازل المعتمدة",
            loading: false,
          });
          return [];
        }
      },

      publishHouse: async (homeData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post(
            `/LandLord/CreateAdvertisement`,
            homeData
          );
          console.log("Publish House Response:", response);
          set({ loading: false });
          return true;
        } catch (err) {
          console.error("Error publishing house:", err);
          set({
            error: err.response?.data?.message || "حدث خطأ أثناء نشر المنزل",
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
