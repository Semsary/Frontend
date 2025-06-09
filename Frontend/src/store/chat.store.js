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

    const handleReceive = (msg) => {
      get().addMessage(msg);
      get().updateConversationLastMessage(msg.senderId, msg.receiverId, msg);
    };
    socket.on("msg-receive", handleReceive);

    // Handle conversation updates
    const handleConversationUpdate = (data) => {
      console.log("Conversation updated:", data);
      get().updateConversation(data.conversationId, data.updates);
    };
    socket.on("conversation-updated", handleConversationUpdate);

    // Handle new conversation
    const handleNewConversation = (conversation) => {
      console.log("New conversation:", conversation);
      set((state) => ({
        conversations: [conversation, ...state.conversations],
      }));
    };
    socket.on("new-conversation", handleNewConversation);

    // Handle message read status
    const handleMessageRead = (data) => {
      console.log("Messages marked as read:", data);
      get().markConversationAsRead(data.conversationId);
    };
    socket.on("messages-read", handleMessageRead);

    socket.on("online-users", (users) => {
      set({ onlineUsers: new Map(users) });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      set({ error: "فشل في الاتصال بالخادم" });
    });

    return () => {
      socket.off("msg-receive", handleReceive);
      socket.off("conversation-updated", handleConversationUpdate);
      socket.off("new-conversation", handleNewConversation);
      socket.off("messages-read", handleMessageRead);
      socket.off("online-users");
      socket.off("connect_error");
    };
  },
}));

export default useChatStore;
