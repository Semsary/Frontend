import { create } from "zustand";
import { io } from "socket.io-client";
import axiosChat from "./../config/api/axiosChat.jsx";
import axiosInstance from "../config/api/axiosInstance.jsx";

let data = localStorage.getItem("auth-storage");
let token = null;
let socket = null;

if (data) {
  data = JSON.parse(data);
  token = data?.state?.token;
}
const apiLink = import.meta.env.VITE_CHAT_URL || "http://localhost:3000";
const apiLinkSocket = import.meta.env.VITE_CHAT_URL_SOCKET || "http://localhost:3000";

// if (token) {
//   socket = io(apiLink, {
//     withCredentials: true,
//     autoConnect: false,
//     auth: {
//       token,
//     },
//   });

//   socket.connect(); // مهم

//   // 🔁 إعادة تعيين التوكن عند محاولات إعادة الاتصال
//   socket.on("reconnect_attempt", () => {
//     let data = localStorage.getItem("auth-storage");
//     if (data) {
//       data = JSON.parse(data);
//     }
//     const token = data?.state?.token;
//     socket.auth.token = token;
//   });
// }


// if (token) {
//   try {
//     token = JSON.parse(token)?.state?.token;
//   } catch (err) {
//     console.error("❌ Invalid token in localStorage:", err);
//     token = null;
//   }
// }


if (token) {
  console.log("token:11 ", token);
  socket = io(apiLinkSocket, {
    withCredentials: true,
    autoConnect: false,
    auth: {
      token, // ✅ هنا فقط
    },
  });
  

  socket.connect();
}



const useChatStore = create((set, get) => ({
  messages: [],
  message: "",
  isLoading: false,
  error: null,
  onlineUsers: new Map(),
  conversations: [],
  conversationsLoading: false,

  setMessage: (text) => set({ message: text }),

  // Add conversation management methods
  setConversations: (conversations) => set({ conversations }),
  setConversationsLoading: (loading) => set({ conversationsLoading: loading }),

  updateConversation: (conversationId, updates) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      ),
    }));
  },

  updateConversationLastMessage: (senderId, receiverId, message) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id === senderId || conv.id === receiverId) {
          return {
            ...conv,
            lastMessage: message.content,
            timestamp: new Date(message.timestamp).getTime(),
            unreadCount:
              conv.id === receiverId
                ? (conv.unreadCount || 0) + 1
                : conv.unreadCount,
          };
        }
        return conv;
      }),
    }));
  },

  markConversationAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
    }));
  },

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

      const newMessage = {
        senderId,
        content,
        timestamp: new Date().toISOString(),
      };

      get().addMessage(newMessage);
      get().updateConversationLastMessage(senderId, receiverId, newMessage);

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
      // console.log("Fetched messages:", data.messages);
      set({ messages: data.messages });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: "فشل في تحميل الرسائل" });
    } finally {
      set({ isLoading: false });
    }
  },

  getUserData: async (userId) => {
    try {
      const { data } = await axiosInstance.get(`/Chat/User/Info/${userId}`);
      return data;
    } catch (err) {
      console.error("Fetch user data error:", err);
      throw new Error("فشل في تحميل بيانات المستخدم");
    }
  },

  setupSocketConnection: (currentUserId) => {
 
    let data = localStorage.getItem("auth-storage");
    let token = null;

    if (data) {
      try {
        data = JSON.parse(data);
        token = data?.state?.token;
      } catch (err) {
        console.error("❌ فشل في قراءة التوكن من localStorage");
      }
    }

    if (!token) {
      set({ error: "لا يوجد توكن صالح" });
      return;
    }

    socket = io(apiLinkSocket, {
      withCredentials: true,
      autoConnect: false,
      auth: {
        token,
      },
    });

    socket.connect();

    socket.emit("add-user", currentUserId);

    const handleReceive = (msg) => {
      console.log("dfdf --- ",msg)
      get().addMessage(msg);
      get().updateConversationLastMessage(msg.senderId, msg.receiverId, msg);
    };
    socket.on("msg-receive", handleReceive);

    socket.on("conversation-updated", (data) => {
      get().updateConversation(data.conversationId, data.updates);
    });

    socket.on("new-conversation", (conversation) => {
      set((state) => ({
        conversations: [conversation, ...state.conversations],
      }));
    });

    socket.on("messages-read", (data) => {
      get().markConversationAsRead(data.conversationId);
    });

    socket.on("online-users", (users) => {
      set({ onlineUsers: new Map(users) });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      set({ error: "فشل في الاتصال بالخادم" });
    });

    return () => {
      socket.off("msg-receive", handleReceive);
      socket.off("conversation-updated");
      socket.off("new-conversation");
      socket.off("messages-read");
      socket.off("online-users");
      socket.off("connect_error");
    };
  },
}));

export default useChatStore;