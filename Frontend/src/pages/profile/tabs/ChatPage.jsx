import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessageCircle, Send, Phone, Mail, Clock, User, Search, Settings, Menu, X, Loader2, CheckCheck, AlertCircle, MessageCircleMore } from 'lucide-react';
import useChatStore from '../../../store/chat.store';
import axiosChat from '../../../config/api/axiosChat';
import useAuthStore from '../../../store/auth.store';
import { Link } from 'react-router-dom';
import useProfileStore from './../../../store/profile.store';

// Default users configuration
const DEFAULT_USERS = [
  {
    id: "CustomerService1",
    name: "خدمة العملاء",
    avatar: 'https://avatar.iran.liara.run/public/boy?username=customer_service',
    lastMessage: "مرحباً، كيف يمكنني مساعدتك؟",
    type: "support"
  },
  // {
  //   id: "landlord3",
  //   name: "المدير",
  //   avatar: 'https://avatar.iran.liara.run/public/boy?username=المدير',
  //   lastMessage: "أهلاً وسهلاً بك",
  //   type: "admin"
  // },
  // {
  //   id: "landlord2",
  //   name: "قسم المبيعات",
  //   avatar: 'https://avatar.iran.liara.run/public/girl?username=المبيعات',
  //   lastMessage: "كيف يمكنني مساعدتك في الشراء؟",
  //   type: "sales"
  // }
];

const ChatPage = () => {
  // State management
  const [activeConversation, setActiveConversation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState("");

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevActiveConversationRef = useRef("");

  // Store hooks
  const { getUser } = useAuthStore();
  const {user} = useProfileStore();
  const currentUserId = user?.username || "01JX9V1H7CD8TTMDF5RGETXRGB";
  console.log("Current User ID:", currentUserId);

  const {
    messages,
    message,
    isLoading,
    error,
    onlineUsers,
    setMessage,
    sendMessage,
    fetchMessages,
    setupSocketConnection,
    clearMessages
  } = useChatStore();

  // Memoized values
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const currentConversation = useMemo(() => {
    return conversations.find(conv => conv.id === activeConversation);
  }, [conversations, activeConversation]);

  // Utility functions
  const createDefaultUser = useCallback((defaultUser) => ({
    ...defaultUser,
    timestamp: Date.now(),
    unreadCount: 0,
    isOnline: false,
    updatedAt: new Date().toISOString(),
    _id: `default_${defaultUser.id}`
  }), []);

  const formatTime = useCallback((timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `${minutes} د`;
    if (hours < 24) return `${hours} س`;
    if (days < 7) return `${days} يوم`;

    return new Date(timestamp).toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const formatMessageTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }, []);

  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Transform API data
  const transformConversationsData = useCallback((apiConversations) => {
    if (!Array.isArray(apiConversations)) return [];

    return apiConversations.map((conv) => {
      const participantId = conv.otherParticipant ;
      const defaultUser = DEFAULT_USERS.find(u => u.id === participantId);
      const Data = {
        id: participantId,
        name: defaultUser?.name || `مستخدم ${participantId}`,
        avatar: defaultUser?.avatar || `https://avatar.iran.liara.run/public/boy?username=${participantId}`,
        lastMessage: conv.lastMessage?.content || defaultUser?.lastMessage || "لا توجد رسائل",
        timestamp: conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).getTime() : Date.now(),
        unreadCount: conv.unreadCount || 0,
        isOnline: false,
        type: defaultUser?.type || "direct",
        updatedAt: conv.updatedAt,
        _id: conv._id
      }

      console.log("Transformed conversation data:", Data);

      return Data;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, []);

  // Conversation management
  const updateConversationWithNewMessage = useCallback((newMessage) => {
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conv => {
        const isRelevantConversation =
          (newMessage.senderId === currentUserId && newMessage.receiverId === conv.id) ||
          (newMessage.receiverId === currentUserId && newMessage.senderId === conv.id);

        if (isRelevantConversation) {
          return {
            ...conv,
            lastMessage: newMessage.content,
            timestamp: new Date(newMessage.timestamp).getTime(),
            updatedAt: newMessage.timestamp,
            unreadCount: activeConversation === conv.id ? 0 : conv.unreadCount + (newMessage.senderId !== currentUserId ? 1 : 0)
          };
        }
        return conv;
      });

      return updatedConversations.sort((a, b) => b.timestamp - a.timestamp);
    });
  }, [currentUserId, activeConversation]);

  const fetchConversations = useCallback(async () => {
    try {
      setConversationsLoading(true);
      setConversationsError("");

      const response = await axiosChat.get("/messages/conversations");
      const apiData = response.data?.conversations || response.data || [];

      let transformedConversations = transformConversationsData(apiData);

      // Add missing default users
      const existingIds = new Set(transformedConversations.map(conv => conv.id));
      const missingDefaultUsers = DEFAULT_USERS
        .filter(defaultUser => !existingIds.has(defaultUser.id))
        .map(createDefaultUser);

      transformedConversations = [...missingDefaultUsers, ...transformedConversations]
        .sort((a, b) => b.timestamp - a.timestamp);

      setConversations(transformedConversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setConversationsError("فشل في تحميل المحادثات");

      // Fallback to default users only
      const defaultConversations = DEFAULT_USERS.map(createDefaultUser);
      setConversations(defaultConversations);
    } finally {
      setConversationsLoading(false);
    }
  }, [transformConversationsData, createDefaultUser]);

  // Event handlers
  const handleSend = useCallback(async () => {
    if (!message.trim() || !activeConversation || !currentUserId || isLoading) {
      return;
    }

    try {
      const messageData = {
        senderId: currentUserId,
        receiverId: activeConversation,
        content: message.trim()
      };

      await sendMessage(messageData);

      const newMessage = {
        ...messageData,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      updateConversationWithNewMessage(newMessage);

      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [message, activeConversation, currentUserId, isLoading, sendMessage, updateConversationWithNewMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleConversationClick = useCallback((conversationId) => {
    setActiveConversation(conversationId);
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [isMobile]);

  // Effects
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(mobile ? (!activeConversation) : true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeConversation]);

  useEffect(() => {
    if (!currentUserId) return;

    let cleanup;
    try {
      cleanup = setupSocketConnection(currentUserId);
    } catch (error) {
      console.error("Failed to setup socket connection:", error);
    }

    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [currentUserId, setupSocketConnection]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConversation && currentUserId && activeConversation !== prevActiveConversationRef.current) {
      clearMessages();
      fetchMessages(currentUserId, activeConversation);
      prevActiveConversationRef.current = activeConversation;
    }
  }, [activeConversation, currentUserId, fetchMessages, clearMessages]);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (conversations.length > 0) {
      const updatedConversations = conversations.map(conv => ({
        ...conv,
        isOnline: isUserOnline(conv.id)
      }));

      const hasOnlineStatusChange = updatedConversations.some((conv, index) =>
        conv.isOnline !== conversations[index]?.isOnline
      );

      if (hasOnlineStatusChange) {
        setConversations(updatedConversations.sort((a, b) => b.timestamp - a.timestamp));
      }
    }
  }, [onlineUsers, isUserOnline, conversations]);

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
          </div>
        </div>
      </div>
    ))
  );

  return (
    <div className=" " dir="rtl">
      <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
          {/* Customer Service Representatives */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="ml-2" size={20} />
                فريق خدمة العملاء
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="البحث في المحادثات..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right"
                />
              </div>

              {/* Error Alert */}
              {conversationsError && (
                <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-xl flex items-center gap-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-700 text-sm font-medium">{conversationsError}</span>
                </div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conversationsLoading ? (
                  renderLoadingSkeleton()
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-center font-medium mb-1">
                      {searchQuery ? "لا توجد محادثات مطابقة" : "لا توجد محادثات"}
                    </p>
                    <p className="text-gray-400 text-center text-sm">
                      {searchQuery ? "جرب البحث بكلمات أخرى" : "ابدأ محادثة جديدة مع فريق الدعم"}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                        activeConversation === conversation.id
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar Section */}
                        <div className="relative flex-shrink-0">
                          <div className="relative">
                            <img
                              src={conversation.avatar}
                              alt={conversation.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            {/* Online Status */}
                            {conversation.isOnline && (
                              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                            )}
                          </div>
                          {/* Unread Badge */}
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 min-w-[22px] h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-2 shadow-md">
                              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold text-gray-900 truncate text-base ${
                              activeConversation === conversation.id ? 'text-blue-700' : ''
                            }`}>
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-gray-500 font-medium flex-shrink-0 mr-2">
                              {formatTime(conversation.timestamp)}
                            </span>
                          </div>

                          {/* Last Message */}
                          <p className="text-sm text-gray-600 truncate mb-2 leading-relaxed">
                            {conversation.lastMessage}
                          </p>

                          {/* Status and Type */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Online Status Text */}
                              <div className={`flex items-center gap-1.5 text-xs font-medium ${
                                isUserOnline(conversation.id) ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  isUserOnline(conversation.id) ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                                {isUserOnline(conversation.id) ? 'متصل الآن' : 'غير متصل'}
                              </div>

                              {/* Conversation Type Badge */}
                              {conversation.type && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  conversation.type === 'support' ? 'bg-blue-100 text-blue-700' :
                                  conversation.type === 'admin' ? 'bg-purple-100 text-purple-700' :
                                  conversation.type === 'sales' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {conversation.type === 'support' ? 'دعم فني' :
                                   conversation.type === 'admin' ? 'إدارة' :
                                   conversation.type === 'sales' ? 'مبيعات' : 'عام'}
                                </span>
                              )}
                            </div>

                            {/* Chat Arrow Indicator */}
                            <div className={`transition-transform duration-200 ${
                              activeConversation === conversation.id ? 'rotate-180' : 'group-hover:translate-x-1'
                            }`}>
                              <MessageCircle className={`h-4 w-4 ${
                                activeConversation === conversation.id ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
            <div className="mt-4 text-center text-gray-500 bg-white rounded-2xl shadow-md p-3 border border-gray-200">
                <Link to="/chat"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <MessageCircleMore size={20} />
                 فتح المحادثة الكاملة
                </Link>
                
                
              </div>              
          </div>

          {/* Chat Interface */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl">
                {currentConversation ? (
                  <div className="flex items-center text-white">
                    <img
                      src={currentConversation.avatar}
                      alt={currentConversation.name}
                      className="w-10 h-10 rounded-full ml-3 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{currentConversation.name}</h3>
                      <p className="text-blue-100 text-sm">
                        {isUserOnline(currentConversation.id) ? 'متصل الآن' : 'غير متصل'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <MessageCircle size={24} className="mx-auto mb-2" />
                    <p>اختر موظف خدمة العملاء لبدء المحادثة</p>
                  </div>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {currentConversation ? (
                  <>
                    {isLoading && messages.length === 0 && (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      </div>
                    )}

                    {error && (
                      <div className="flex justify-center">
                        <div className="max-w-md p-3 border border-red-200 bg-red-50 rounded-lg flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-700">{error}</span>
                        </div>
                      </div>
                    )}

                    {!isLoading && !error && messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-20">
                        <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>ابدأ محادثتك مع {currentConversation.name}</p>
                        <p className="text-sm mt-2">اكتب رسالتك أدناه</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg, i) => {
                          const isOwn = msg.senderId === currentUserId;
                          return (
                            <div key={msg.id || i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwn
                                  ? 'bg-blue-500 text-white rounded-br-sm'
                                  : 'bg-white text-gray-800 border rounded-bl-sm'
                                }`}>
                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                  {msg.content}
                                </p>
                                <div className={`text-xs mt-1 flex items-center gap-1 ${isOwn ? 'text-blue-100 justify-start' : 'text-gray-500 justify-end'
                                  }`}>
                                  {isOwn && <CheckCheck className="h-3 w-3" />}
                                  <span>{formatMessageTime(msg.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 mt-20">
                    <User size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>يرجى اختيار موظف خدمة العملاء</p>
                    <p className="text-sm mt-2">لبدء المحادثة</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                {currentConversation ? (
                  <div className="flex space-x-2 space-x-reverse">
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="اكتب رسالتك هنا..."
                      disabled={isLoading}
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 text-right"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!message.trim() || isLoading}
                      className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    اختر موظف خدمة العملاء لبدء كتابة الرسائل
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default ChatPage;