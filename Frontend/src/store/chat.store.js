import { create } from "zustand";
import axiosChat from "./../config/api/axiosChat.jsx";

const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  message: "",

  // Actions
  addMessage: (newMessage) => {
    set({ messages: [...get().messages, newMessage] });
  },

  updateMessage: (text) => {
    set({ message: text });
  },

  clearMessage: () => {
    set({ message: "" });
  },

  sendMessage: async (messageData) => {
    try {
      set({ isLoading: true });
      await axiosChat.post("/messages", messageData);
    } catch (error) {
      console.error("Message send error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (senderId, receiverId) => {
    try {
      set({ isLoading: true });
      const { data } = await axiosChat.get(
        `/messages?senderId=${senderId}&receiverId=${receiverId}`
      );
      set({ messages: data });
    } catch (error) {
      console.error("Fetch messages error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useChatStore;
