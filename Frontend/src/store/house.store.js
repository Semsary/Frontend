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
      filteredAdvertisements: [],
      searchFilters: {},
      setSearchFilters: (filters) => set({ searchFilters: filters }),

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
              err.response?.data?.message ||
              "حدث خطأ أثناء جلب المنازل المعتمدة",
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

      getAdvertisements: async () => {
        const filters = get().searchFilters;

        // إزالة الفلاتر الفارغة قبل إرسالها
        const cleanedFilters = Object.fromEntries(
          Object.entries(filters).filter(
            ([_, value]) => value !== "" && value !== null
          )
        );

        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.get("/Tenant/Search", {
            params: cleanedFilters, // الفلاتر بعد التنظيف
          });
          set({ loading: false, filteredAdvertisements: response.data });
        } catch (err) {
          set({
            loading: false,
            error: err.response?.data?.message || "حدث خطأ أثناء جلب الإعلانات",
          });
        }
      },

      getHouseById: async (houseId) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get(
            `/Tenant/Advertisment/Detials/${houseId}`
          );
          set({ loading: false });
          return response.data;
        } catch (err) {
          console.error("Error fetching house by ID:", err);
          set({
            error:
              err.response?.data?.message || "حدث خطأ أثناء جلب المنزل",
            loading: false,
          });
          return null;
        }
      },


      // {
//   "startDate": "2025-06-17T15:01:08.106Z",
//   "endDate": "2025-06-17T15:01:08.106Z",
//   "startArrivalDate": "2025-06-17T15:01:08.106Z",
//   "endArrivalDate": "2025-06-17T15:01:08.106Z",
//   "advId": "string"
// }
      checkAvailabilityOfBedroom: async (startDate, endDate, startArrivalDate, endArrivalDate, advId) => {
        set({ loading: true, error: null });
        console.log("Availability Response:", {
          startDate,
          endDate,
          startArrivalDate,
          endArrivalDate,
          AdvId: advId,
        });
        try {
          const response = await axiosInstance.post(
            `/Tenant/show/available/rentalUnits`,
            {
              startDate,
              endDate,
              startArrivalDate,
              endArrivalDate,
              AdvId:advId,
            }
          );
          console.log("Availability Response:", response.data);

          if (response.data.length === 0) {
            set({
              error: "لا توجد وحدات متاحة في هذا التاريخ",
              loading: false,
            });
            return {
              availableBeds: [],
              type : "ByHome",

              message: "لا توجد وحدات متاحة في هذا التاريخ",
            };
          }else if (response.data.length === 1) {
            set({
              error: null,
              loading: false,
            });
            return {
              availableBeds: response.data,
              type : "ByHome",
              message: "وحدة واحدة متاحة",
            };
          }else {
            set({
              error: null,
              loading: false,
            });
            return {
              availableBeds: response.data,
              type : "ByBedroom",
              message: "تم العثور على وحدات متاحة",
            };
          }
        } catch (err) {
          console.error("Error checking availability:", err);
          set({
            error:
              err.response?.data?.message || "حدث خطأ أثناء التحقق من التوفر",
            loading: false,
          });
          return null;
        }
      },


      // {
      //   "startDate": "2025-06-17T15:47:10.033Z",
      //   "endDate": "2025-06-17T15:47:10.033Z",
      //   "rentalType": 0,
      //   "houseId": "string",
      //   "startArrivalDate": "2025-06-17T15:47:10.033Z",
      //   "endArrivalDate": "2025-06-17T15:47:10.033Z",
      //   "rentalUnitIds": [
      //     "string"
      //   ]
      // }
      bookRentalUnit: async (startDate, endDate, rentalType, houseId, startArrivalDate, endArrivalDate, rentalUnitIds) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post(
            `/Tenant/Make/Rental/Request`,
            {
              startDate,
              endDate,
              rentalType,
              houseId,
              startArrivalDate,
              endArrivalDate,
              rentalUnitIds, 
            }
          );
          console.log("Booking Response:", response.data);
          set({ loading: false });
          return response.data;
        } catch (err) {
          console.error("Error booking rental unit:", err);
          set({
            error:
              err.response?.data?.message || "حدث خطأ أثناء حجز الوحدة",
            loading: false,
          });
          return null;
        }
      },

      getRentalRequests: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get(
            "/LandLord/All/Rental/Requests"
          );
          set({ loading: false, rentalRequests: response.data });
          return response.data;
        } catch (err) {
          console.error("Error fetching rental requests:", err);
          set({
            error:
              err.response?.data?.message || "حدث خطأ أثناء جلب طلبات الإيجار",
            loading: false,
          });
          return [];
        }
      },

      acceptRentalRequest: async (requestId,status) => {
        set({ loading: true, error: null });
        console.log("Accepting Rental Request:", {
          requestId,
          status,
        });

        // RentalId - path
        // Status - query
        try {
          const response = await axiosInstance.put(
            `/LandLord/Rental/Request/${requestId}`,
            null, // no request body
            { params: { status } }
          );
          set({ loading: false });
          console.log("Accept Rental Request Response:", response.data);
          if (response.status === 200) {
            // Successfully accepted the rental request
            return true;
          }
          return false;
        } catch (err) {
          console.error("Error accepting rental request:", err);
          set({
            error:
              err.response?.data?.message || "حدث خطأ أثناء قبول طلب الإيجار",
            loading: false,
          });
          return false;
        }
      }






    }),
    {
      name: "house-storage",
      partialize: (state) => ({}),
    }
  )
);

export default useHouseStore;
