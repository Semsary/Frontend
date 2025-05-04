import { useEffect, useState, useRef, useCallback } from "react";
import {
  MessageCircle,
  Send,
  Image,
  Paperclip,
  Smile,
  ArrowLeft,
  MoreVertical,
  Search,
} from "lucide-react";

// Mock data for sample conversations in Arabic
const SAMPLE_CONVERSATIONS = [
  {
    id: "conv1",
    name: "أحمد حسن",
    avatar: "/api/placeholder/40/40",
    lastMessage: "متى سيكون المشروع جاهزًا؟",
    unread: 3,
    isOnline: true,
    timestamp: "10:34 ص",
  },
  {
    id: "conv2",
    name: "سارة علي",
    avatar: "/api/placeholder/40/40",
    lastMessage: "شكرًا على التحديث!",
    unread: 0,
    isOnline: true,
    timestamp: "أمس",
  },
  {
    id: "conv3",
    name: "محمد عمر",
    avatar: "/api/placeholder/40/40",
    lastMessage: "لنحدد موعد اجتماع الأسبوع القادم",
    unread: 1,
    isOnline: false,
    timestamp: "الإثنين",
  },
  {
    id: "conv4",
    name: "فاطمة خالد",
    avatar: "/api/placeholder/40/40",
    lastMessage: "تم إرسال الملفات",
    unread: 0,
    isOnline: false,
    timestamp: "01/05",
  },
  {
    id: "conv5",
    name: "ليلى محمود",
    avatar: "/api/placeholder/40/40",
    lastMessage: "هل يمكنك مراجعة التصميم؟",
    unread: 0,
    isOnline: true,
    timestamp: "29/04",
  },
];

// Mock message history for each conversation in Arabic
const CONVERSATION_MESSAGES = {
  conv1: [
    {
      senderId: "5454",
      content: "مرحبًا! كيف يسير المشروع؟",
      timestamp: "2025-05-03T09:30:00Z",
    },
    {
      senderId: "32321",
      content:
        "أهلاً أحمد! نحن نحرز تقدمًا جيدًا. نعمل حاليًا على الواجهة الأمامية.",
      timestamp: "2025-05-03T09:35:00Z",
    },
    {
      senderId: "5454",
      content: "هذا رائع! أي تحديات حتى الآن؟",
      timestamp: "2025-05-03T09:40:00Z",
    },
    {
      senderId: "32321",
      content: "بعض المشاكل البسيطة في التصميم المتجاوب، لكننا نصلحها.",
      timestamp: "2025-05-03T09:45:00Z",
    },
    {
      senderId: "5454",
      content: "متى سيكون المشروع جاهزًا؟",
      timestamp: "2025-05-03T10:34:00Z",
    },
  ],
  conv2: [
    {
      senderId: "5454",
      content: "لقد راجعت أحدث تغييرات الواجهة",
      timestamp: "2025-05-02T14:20:00Z",
    },
    {
      senderId: "32321",
      content: "ما رأيك؟ أي ملاحظات؟",
      timestamp: "2025-05-02T14:25:00Z",
    },
    {
      senderId: "5454",
      content: "التصميم أصبح أنظف الآن. أحب نظام الألوان الجديد.",
      timestamp: "2025-05-02T14:30:00Z",
    },
    {
      senderId: "32321",
      content: "رائع! سأقوم بتنفيذ باقي التغييرات غدًا.",
      timestamp: "2025-05-02T14:35:00Z",
    },
    {
      senderId: "5454",
      content: "شكرًا على التحديث!",
      timestamp: "2025-05-02T14:40:00Z",
    },
  ],
  conv3: [
    {
      senderId: "5454",
      content: "نحتاج لمناقشة المرحلة التالية من التطوير",
      timestamp: "2025-05-01T11:10:00Z",
    },
    {
      senderId: "32321",
      content: "بالطبع، أنا متاح هذا الأسبوع. ما هو الوقت المناسب لك؟",
      timestamp: "2025-05-01T11:15:00Z",
    },
    {
      senderId: "5454",
      content: "لدي جدول مزدحم هذا الأسبوع. هل يمكننا الأسبوع القادم؟",
      timestamp: "2025-05-01T11:20:00Z",
    },
    {
      senderId: "32321",
      content: "نعم، هذا مناسب لي أيضًا. الاثنين أم الثلاثاء؟",
      timestamp: "2025-05-01T11:25:00Z",
    },
    {
      senderId: "5454",
      content: "لنحدد موعد اجتماع الأسبوع القادم",
      timestamp: "2025-05-01T11:30:00Z",
    },
  ],
  conv4: [
    {
      senderId: "5454",
      content: "هل لديك أصول التصميم جاهزة؟",
      timestamp: "2025-05-01T09:05:00Z",
    },
    {
      senderId: "32321",
      content: "نعم، لقد أنهيتها. سأرسلها قريبًا.",
      timestamp: "2025-05-01T09:10:00Z",
    },
    {
      senderId: "5454",
      content: "ممتاز، أحتاجها للعرض التقديمي.",
      timestamp: "2025-05-01T09:15:00Z",
    },
    {
      senderId: "32321",
      content: "لا مشكلة. أقوم بضغطها الآن.",
      timestamp: "2025-05-01T09:20:00Z",
    },
    {
      senderId: "5454",
      content: "تم إرسال الملفات",
      timestamp: "2025-05-01T09:25:00Z",
    },
  ],
  conv5: [
    {
      senderId: "5454",
      content: "لقد أجريت بعض التغييرات على الصفحة الرئيسية",
      timestamp: "2025-04-29T15:45:00Z",
    },
    {
      senderId: "32321",
      content: "دعني ألقي نظرة عليها",
      timestamp: "2025-04-29T15:50:00Z",
    },
    {
      senderId: "5454",
      content: "ركز على قسم البطل، فهناك معظم التغييرات",
      timestamp: "2025-04-29T15:55:00Z",
    },
    {
      senderId: "32321",
      content: "أرى ذلك. الرسوم المتحركة أصبحت أكثر سلاسة الآن.",
      timestamp: "2025-04-29T16:00:00Z",
    },
    {
      senderId: "5454",
      content: "هل يمكنك مراجعة التصميم؟",
      timestamp: "2025-04-29T16:05:00Z",
    },
  ],
};

const mockSocket = {
  emit: (event, data) => console.log(`Socket emitted ${event}:`, data),
  on: (event, callback) => {
    console.log(`Socket listening for ${event}`);
    return () => console.log(`Stopped listening for ${event}`);
  },
  off: (event) => console.log(`Socket stopped listening for ${event}`),
};

const ChatComponent = ({ currentUserId = "32321" }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const messageEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(selectedConversation === null);
      } else {
        setShowSidebar(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [selectedConversation]);

  const fetchMessages = useCallback(
    async (targetUserId) => {
      if (!targetUserId) return;

      try {
        setIsLoading(true);
        const convId = conversations.find((c) => c.id === targetUserId)?.id;
        if (convId && CONVERSATION_MESSAGES[convId]) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setMessages(CONVERSATION_MESSAGES[convId]);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [conversations]
  );

  useEffect(() => {
    if (selectedConversation && inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [selectedConversation, isMobile]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation ? { ...conv, unread: 0 } : conv
        )
      );
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (convId) => {
    setSelectedConversation(convId);
    if (isMobile) setShowSidebar(false);
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowSidebar(true);
      setSelectedConversation(null);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    const newMessage = {
      senderId: currentUserId,
      receiverId: selectedConversation,
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: message, timestamp: "الآن" }
          : conv
      )
    );

    mockSocket.emit("send-msg", {
      ...newMessage,
      receiverId: selectedConversation,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-tajawal"
      dir="rtl"
    >
      {/* Conversations Sidebar */}
      {showSidebar && (
        <div
          className={`bg-white ${
            isMobile ? "w-full" : "w-96"
          } border-l border-gray-200 flex flex-col shadow-lg`}
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-700 to-purple-600 text-white">
            <h2 className="text-2xl font-bold">المحادثات</h2>
          </div>

          <div className="p-4 bg-white border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن المحادثات..."
                className="w-full py-3 pr-10 pl-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? "bg-indigo-50" : ""
                }`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                <div className="relative">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                  />
                  {conv.isOnline && (
                    <span className="absolute bottom-0 left-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="mr-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conv.name}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                      {conv.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          !showSidebar || !isMobile ? "block" : "hidden"
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center shadow-sm">
              {isMobile && (
                <button
                  onClick={handleBackToList}
                  className="ml-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {conversations.find((c) => c.id === selectedConversation) && (
                <>
                  <div className="relative">
                    <img
                      src={
                        conversations.find((c) => c.id === selectedConversation)
                          .avatar
                      }
                      alt={
                        conversations.find((c) => c.id === selectedConversation)
                          .name
                      }
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                    />
                    {conversations.find((c) => c.id === selectedConversation)
                      .isOnline && (
                      <span className="absolute bottom-0 left-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="mr-3">
                    <h3 className="font-semibold text-gray-900">
                      {
                        conversations.find((c) => c.id === selectedConversation)
                          .name
                      }
                    </h3>
                    <p className="text-xs text-green-500">
                      {conversations.find((c) => c.id === selectedConversation)
                        .isOnline
                        ? "متصل الآن"
                        : "غير متصل"}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                      <MessageCircle size={20} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle size={56} className="text-gray-300 mb-4" />
                  <p className="text-lg">لا توجد رسائل بعد. ابدأ المحادثة!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => {
                    const isMine = msg.senderId === currentUserId;
                    const showAvatar =
                      messages[index - 1]?.senderId !== msg.senderId;

                    return (
                      <div
                        key={index}
                        className={`flex ${
                          isMine ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`flex items-end ${
                            isMine ? "flex-row-reverse" : ""
                          }`}
                        >
                          {!isMine && showAvatar && (
                            <img
                              src={
                                conversations.find(
                                  (c) => c.id === selectedConversation
                                )?.avatar || "/api/placeholder/32/32"
                              }
                              alt="avatar"
                              className="w-10 h-10 rounded-full mr-3 flex-shrink-0 border-2 border-white shadow"
                            />
                          )}

                          <div
                            className={`px-4 py-3 rounded-2xl max-w-xs sm:max-w-md ${
                              isMine
                                ? "bg-indigo-600 text-white rounded-tr-none"
                                : "bg-white text-gray-800 rounded-tl-none shadow"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <div
                              className={`text-xs mt-1 text-right ${
                                isMine ? "text-indigo-200" : "text-gray-500"
                              }`}
                            >
                              {formatMessageTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="bg-white border-t border-gray-200 p-4 shadow-lg"
            >
              <div className="flex items-end space-x-2">
                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
                  <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="اكتب رسالة..."
                    className="w-full bg-transparent resize-none focus:outline-none max-h-32 min-h-12 text-right"
                    rows={1}
                    dir="auto"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="p-3 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                  >
                    <Smile size={20} />
                  </button>

                  <button
                    type="button"
                    className="p-3 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                  >
                    <Paperclip size={20} />
                  </button>

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            <div className="w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <MessageCircle size={56} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              رسائلك
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              اختر محادثة من القائمة الجانبية لبدء الدردشة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
