// socket.js
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
  if (!token) {
    console.error("❌ No token provided to initSocket");
    return null;
  }

  socket = io("http://localhost:3000", {
    withCredentials: true,
    autoConnect: false,
    auth: {
      token,
    },
  });

  // ✅ تحديث التوكن عند إعادة الاتصال
  socket.on("reconnect_attempt", () => {
    const data = localStorage.getItem("auth-storage");
    const freshToken = data ? JSON.parse(data)?.state?.token : null;
    socket.auth.token = freshToken;
  });

  socket.connect(); // يجب استدعاؤه بعد تمرير التوكن
  return socket;
};

export const getSocket = () => socket;
