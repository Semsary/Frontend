import axios from "axios";


let data = localStorage.getItem("auth-storage");
if (data) {
  data = JSON.parse(data);
}
const token = data?.state?.token;


const axiosChat = axios.create({ 
    baseURL: import.meta.env.VITE_CHAT_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000, // Set a timeout of 5 seconds
});
    

axiosChat.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosChat.interceptors.response.use(
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


export default axiosChat;

