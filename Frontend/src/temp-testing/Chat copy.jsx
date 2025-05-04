import { useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import useChatStore from "./../store/chat.store.js";

const socket = io("http://localhost:3000", {
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  transports: ["websocket"],
});

const ChatComponent2 = ({ currentUserId = "5454", targetUserId = "32321" }) => {
  const {
    message,
    messages,
    isLoading,
    setLoading,
    addMessage,
    setMessage,
    sendMessage,
  } = useChatStore();

  const messageEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      await useChatStore.getState().fetchMessages(currentUserId, targetUserId);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, targetUserId, setLoading]);

  useEffect(() => {
    socket.emit("add-user", currentUserId);
    fetchMessages();

    const handleMessageReceive = (data) => {
      addMessage(data);
    };

    socket.on("msg-receive", handleMessageReceive);

    return () => {
      socket.off("msg-receive", handleMessageReceive);
    };
  }, [currentUserId, fetchMessages, addMessage]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      senderId: currentUserId,
      receiverId: targetUserId,
      content: message,
      timestamp: new Date().toISOString(),
    };

    addMessage(newMessage); // تحديث الحالة في Zustand على الفور
    socket.emit("send-msg", newMessage); // إرسال الرسالة عبر WebSocket
    sendMessage(newMessage); // إرسال الرسالة عبر axios

    // إعادة تعيين الرسالة
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg">
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <h3 className="font-bold">Chat</h3>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto max-h-96 scroll-smooth"
        style={{ direction: "rtl" }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div style={{ direction: "ltr" }}>
            {messages.map((msg, index) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                      isMine
                        ? "bg-indigo-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow"
                    }`}
                  >
                    {msg.content}
                    <div
                      className={`text-xs mt-1 ${
                        isMine ? "text-indigo-100" : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="bg-white p-4 border-t border-gray-200 rounded-b-lg"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="أكتب رسالة..."
            className="flex-1 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            dir="rtl"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent2;
