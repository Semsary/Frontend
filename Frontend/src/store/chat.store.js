import {create} from "zustand";
import axiosChat from "./../config/api/axiosChat.jsx";
const useChatStore = create((set) => ({
  messages: [],
  isLoading: false,
  message: "",
  addMessage: (message) =>
  set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ isLoading: loading }),
  setMessage: (message) => set({ message }),

   sendMessage: async (messageData) => {
    try {
      set({ isLoading: true });
       await axiosChat.post("/messages", messageData);
      set({ isLoading: false });
    } catch (err) {
      console.error("Error sending message:", err);
      set({ isLoading: false });
    }
  },

  // جلب الرسائل
  fetchMessages: async (currentUserId, targetUserId) => {
    try {
      set({ isLoading: true });
      const response = await axiosChat.get(
        `/messages?senderId=${currentUserId}&receiverId=${targetUserId}`
      );
      set({ messages: response.data });
      set({ isLoading: false });
    } catch (err) {
      console.error("Error fetching messages:", err);
      set({ isLoading: false });
    }
  },
}));

export default useChatStore;
