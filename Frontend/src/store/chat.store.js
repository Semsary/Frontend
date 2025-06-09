import { create } from "zustand";
import { io } from "socket.io-client";
import axiosChat from "./../config/api/axiosChat.jsx";

let data = localStorage.getItem("auth-storage");
let token = null;
let socket = null;

if (data) {
  data = JSON.parse(data);
  token = data?.state?.token;
}

if (token) {
  socket = io("http://localhost:3000", {
    withCredentials: true,
    autoConnect: false,
    auth: {
      token,
    },
  });

  socket.connect(); // مهم

  // 🔁 إعادة تعيين التوكن عند محاولات إعادة الاتصال
  socket.on("reconnect_attempt", () => {
    let data = localStorage.getItem("auth-storage");
    if (data) {
      data = JSON.parse(data);
    }
    const token = data?.state?.token;
    socket.auth.token = token;
  });
}

console.log("token: ", token);

const useChatStore = create((set, get) => ({
  messages: [],
  message: "",
  isLoading: false,
  error: null,
  onlineUsers: new Map(),

  setMessage: (text) => set({ message: text }),

  addMessage: (msg) => {
    set((state) => ({
      messages: [...state.messages, msg],
      error: null,
    }));
  },

  clearMessages: () => set({ messages: [] }),

  sendMessage: async ({ senderId, receiverId, content }) => {
    if (!content.trim() || !socket) return;
    try {
      set({ isLoading: true, error: null });

      await axiosChat.post("/messages", { senderId, receiverId, content });

      socket.emit("send-msg", { senderId, receiverId, content });

      get().addMessage({
        senderId,
        content,
        timestamp: new Date().toISOString(),
      });

      set({ message: "" });
    } catch (err) {
      console.error("Send error:", err);
      set({ error: "فشل في إرسال الرسالة" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (senderId, receiverId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axiosChat.get(
        `/messages?senderId=${senderId}&receiverId=${receiverId}`
      );
      set({ messages: data.messages });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: "فشل في تحميل الرسائل" });
    } finally {
      set({ isLoading: false });
    }
  },

  setupSocketConnection: (currentUserId) => {
    if (!socket) {
      // Initialize socket if not already created
      let data = localStorage.getItem("auth-storage");
      let token = null;
      if (data) {
        data = JSON.parse(data);
        token = data?.state?.token;
      }

      if (token) {
        socket = io("http://localhost:3000", {
          withCredentials: true,
          autoConnect: false,
          auth: {
            token,
          },
        });
      } else {
        set({ error: "لا يوجد توكن صالح" });
        return;
      }
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("add-user", currentUserId);

    const handleReceive = (msg) => get().addMessage(msg);
    socket.on("msg-receive", handleReceive);

    socket.on("online-users", (users) => {
      set({ onlineUsers: new Map(users) });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      set({ error: "فشل في الاتصال بالخادم" });
    });

    return () => {
      socket.off("msg-receive", handleReceive);
      socket.off("online-users");
      socket.off("connect_error");
    };
  },
}));

export default useChatStore;
