import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, 
});


export const axiosInstanceFile = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 5000, 
});






axiosInstance.interceptors.request.use(
  (config) => {
    let data = localStorage.getItem("auth-storage");

    if (data) {
      data = JSON.parse(data);
    }
    const token = data?.state?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
      }
    } else if (error.request) {
      console.error("No response received from server.");
      console.error("Request details:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


