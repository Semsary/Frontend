import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Search,
  Plus,
  Settings,
  Bell,
  Archive,
  Pin,
  Trash2,
  Edit3,
  Check,
  CheckCheck,
  Menu,
  X,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useChatStore from "../store/chat.store";
import axiosChat from "../config/api/axiosChat";
import useAuthStore from "../store/auth.store";
import Navbar from './../components/navbar/Navbar';
import { useParams } from "react-router-dom";


const ChatPage = () => {
  const [activeConversation, setActiveConversation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatUserData, setNewChatUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevActiveConversationRef = useRef("");
  // const currentUserId = "tenant1";
  const [currentUserId, setCurrentUserId] = useState(""); // Replace with actual user ID from auth store

  const { id: newConversationId } = useParams();

  const { getUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      console.log("Current user:", user);
      setCurrentUserId(user?.username || "");
      document.title = "Semsary | Chat"
    };
    
    fetchUser();
  }, [getUser]);



  // Zustand store
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
    clearMessages,
    getUserData
  } = useChatStore();


  const handelgetUserData = useCallback(async (userId) => {
    try {
      const userData = await getUserData(userId);
      console.log("Fetched user data:", userData);
      return userData;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw new Error("فشل في تحميل بيانات المستخدم");
    }
  }, []);

  // Memoized filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  // Memoized current conversation
  const currentConversation = useMemo(() => {
    return conversations.find(conv => conv.id === activeConversation);
  }, [conversations, activeConversation]);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !activeConversation) {
        setShowSidebar(true);
      } else if (mobile && activeConversation) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeConversation]);

  // Update conversation when new message is received
  const updateConversationWithNewMessage = useCallback((newMessage) => {
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conv => {
        // Check if this message belongs to this conversation
        const isRelevantConversation =
          (newMessage.senderId === currentUserId && newMessage.receiverId === conv.id) ||
          (newMessage.receiverId === currentUserId && newMessage.senderId === conv.id);

        if (isRelevantConversation) {
          return {
            ...conv,
            lastMessage: newMessage.content,
            timestamp: new Date(newMessage.timestamp).getTime(),
            updatedAt: newMessage.timestamp,
            // Reset unread count if user is currently viewing this conversation
            unreadCount: activeConversation === conv.id ? 0 : conv.unreadCount + (newMessage.senderId !== currentUserId ? 1 : 0)
          };
        }
        return conv;
      });

      // Sort conversations by most recent activity (timestamp)
      return updatedConversations.sort((a, b) => b.timestamp - a.timestamp);
    });
  }, [currentUserId, activeConversation]);

  // Listen for new messages and update conversations
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      updateConversationWithNewMessage(latestMessage);
    }
  }, [messages, updateConversationWithNewMessage]);

  // Transform API conversations data to expected format
  const transformConversationsData = useCallback((apiConversations) => {
    if (!Array.isArray(apiConversations)) return [];

    const transformed = apiConversations.map(async (conv, index) => {
      // Get the other participant's name (you might want to fetch user details)
      const participantId = conv.otherParticipant;

      // Generate avatar from participant name or ID
      const getAvatar = (name) => {
        return 'https://avatar.iran.liara.run/public/boy?username=' + name;
      };

      // Generate display name using handelgetUserData
      const getDisplayName = async (id) => {
        if (!id) return "مستخدم غير معروف";

        // Check for special cases first
        switch (id) {
          case "CustomerService1": return "خدمة العملاء";
          case "01JX9V1H7CD8TTMDF5RGETXRGB": return "المدير";
          default:
            try {
              const userData = await handelgetUserData(id);
              return `${userData.firstName} ${userData.lastName}` || `مستخدم ${id}`;
            } catch (error) {
              console.error(`Failed to fetch user data for ${id}:`, error);
              return `مستخدم ${id}`;
            }
        }
      };

      const displayName = await getDisplayName(participantId);

      return {
        id: participantId,
        name: displayName,
        avatar: getAvatar(displayName),
        lastMessage: conv.lastMessage?.content || "لا توجد رسائل",
        timestamp: conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).getTime() : Date.now(),
        unreadCount: conv.unreadCount || 0,
        isOnline: false, // You'll need to get this from online users
        type: conv.participants?.length > 2 ? "group" : "direct",
        updatedAt: conv.updatedAt,
        _id: conv._id
      };
    });

    // Wait for all async operations to complete
    return Promise.all(transformed).then(results => {
      // Sort by most recent activity
      return results.sort((a, b) => b.timestamp - a.timestamp);
    });
  }, [handelgetUserData]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setConversationsLoading(true);
      setConversationsError("");
      const response = await axiosChat.get("/messages/conversations");

      console.log("Conversations response:", response.data);

      if (response.data && response.data.conversations && Array.isArray(response.data.conversations)) {
        const transformedConversations = await transformConversationsData(response.data.conversations);
        setConversations(transformedConversations);
        console.log("Transformed conversations:", transformedConversations);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where conversations are directly in response.data
        const transformedConversations = await transformConversationsData(response.data);
        setConversations(transformedConversations);
        console.log("Transformed conversations:", transformedConversations);
      } else {
        console.warn("Invalid conversations data structure:", response.data);
        setConversations([]);
        setConversationsError("تنسيق البيانات غير صحيح");
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setConversationsError("فشل في تحميل المحادثات");
      setConversations([]);
    } finally {
      setConversationsLoading(false);
    }
  }, [transformConversationsData]);

  // Setup socket connection on component mount
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

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation && currentUserId && activeConversation !== prevActiveConversationRef.current) {
      clearMessages();
      fetchMessages(currentUserId, activeConversation);
      prevActiveConversationRef.current = activeConversation;
    }
  }, [activeConversation, currentUserId, fetchMessages, clearMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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

      // Update conversation immediately after sending
      const newMessage = {
        ...messageData,
        timestamp: new Date().toISOString(),
        id: Date.now() // Temporary ID
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





  const addNewChat = () => {


    const userData = handelgetUserData(newConversationId);





    const newConversation = {
      id: newConversationId,
      name: userData.firstName + " " + userData.lastName || "مستخدم جديد",
      avatar: userData.profilePic || `https://avatar.iran.liara.run/public/${userData.id}`,
      lastMessage: "لا توجد رسائل بعد",
      timestamp: Date.now(),
      unreadCount: 0,
      isOnline: false,
      type: "direct",
      updatedAt: new Date().toISOString(),
      _id: `new-${Date.now()}`
    };

    console.log("Adding new conversation:", newConversation);

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    if (isMobile) {
      setShowSidebar(false);

      // Focus on the message input
      inputRef.current?.focus();
    }
  };

  // useEffect(() => {
  //   if (id) {
  //     addNewChat();
  //   }
  // }, [id]);


  // useEffect(() => {
  //   console.log("Active conversation changed:", conversations);
  // }, [conversations]);







  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Update conversations with online status when onlineUsers changes
  useEffect(() => {
    if (conversations.length > 0) {
      const updatedConversations = conversations.map(conv => ({
        ...conv,
        isOnline: isUserOnline(conv.id)
      }));

      // Only update if there's a change in online status
      const hasOnlineStatusChange = updatedConversations.some((conv, index) =>
        conv.isOnline !== conversations[index]?.isOnline
      );

      if (hasOnlineStatusChange) {
        // Maintain sort order when updating online status
        setConversations(updatedConversations.sort((a, b) => b.timestamp - a.timestamp));
      }
    }
  }, [onlineUsers, isUserOnline]);

  const handleConversationClick = useCallback((conversationId) => {
    setActiveConversation(conversationId);
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [isMobile]);

  const ConversationSkeleton = () => (
    <div className="p-4 border-b border-gray-100/50">
      <div className="flex items-start gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );

  const ConversationItem = React.memo(({ conversation, isActive, onClick }) => {
    if (!conversation) return null;

    return (
      <div
        onClick={() => onClick(conversation.id)}
        className={`relative p-4 cursor-pointer transition-all duration-200 border-b border-gray-100/50 hover:bg-gray-50/70 ${isActive ? 'bg-blue-50/80 border-r-4 border-r-blue-500 shadow-sm' : ''
          }`}
      >
        <div className="flex flex-row-reverse items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-row-reverse items-center justify-between mb-1">
              <span className="text-xs text-gray-500 shrink-0 ml-2">
                {formatTime(conversation.timestamp)}
              </span>
              <h3 className={`font-semibold truncate text-sm text-right ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                {conversation.name || 'مستخدم غير معروف'}
              </h3>
            </div>

            <div className="flex flex-row-reverse items-center justify-between">
              {conversation.unreadCount === 0 && (
                <CheckCheck className="h-4 w-4 text-blue-500 shrink-0 ml-2" />
              )}
              <p className="text-sm text-gray-600 truncate flex-1 text-right">
                {conversation.lastMessage || 'لا توجد رسائل'}
              </p>
            </div>
          </div>

          <div className="relative shrink-0">

            <img
              src={conversation.avatar || 'https://avatar.iran.liara.run/public' + conversation.name}
              alt={conversation.name}
              className={`w-12 h-12 rounded-full object-cover shadow-md    'bg-gradient-to-r from-blue-500 to-blue-600'
                                }`}
            />
            {conversation.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            )}
            {conversation.unreadCount > 0 && (
              <div className="absolute -top-1 -left-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });

  // Add debug information in development
  // useEffect(() => {
  //     if (process.env.NODE_ENV === 'development') {
  //         console.log('Current conversations state:', conversations);
  //         console.log('Filtered conversations:', filteredConversations);
  //         console.log('Active conversation:', activeConversation);
  //         console.log('Current conversation:', currentConversation);
  //     }
  // }, [conversations, filteredConversations, activeConversation, currentConversation]);

  // Show modal when newConversationId is present
  useEffect(() => {
    if (newConversationId && !conversations.find(conv => conv.id === newConversationId)) {
      setShowNewChatModal(true);
      fetchUserDataForModal(newConversationId);
    }
  }, [newConversationId, conversations]);

  const fetchUserDataForModal = useCallback(async (userId) => {
    try {
      setLoadingUserData(true);
      const userData = await handelgetUserData(userId);
      setNewChatUserData(userData);
    } catch (error) {
      console.error("Failed to fetch user data for modal:", error);
      // Set default data if fetch fails
      setNewChatUserData({
        firstName: userData.firstName + " " + userData.lastName || "مستخدم جديد",
        lastName: userId,
        profilePic: `https://avatar.iran.liara.run/public/${userId}`
      });
    } finally {
      setLoadingUserData(false);
    }
  }, [handelgetUserData]);

  const handleStartConversation = useCallback(() => {
    if (newConversationId && newChatUserData) {
      const newConversation = {
        id: newConversationId,
        name: `${newChatUserData.firstName} ${newChatUserData.lastName}` || "مستخدم جديد",
        avatar: newChatUserData.profilePic || `https://avatar.iran.liara.run/public/${newConversationId}`,
        lastMessage: "لا توجد رسائل بعد",
        timestamp: Date.now(),
        unreadCount: 0,
        isOnline: false,
        type: "direct",
        updatedAt: new Date().toISOString(),
        _id: `new-${Date.now()}`
      };

      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversation.id);
      setShowNewChatModal(false);

      if (isMobile) {
        setShowSidebar(false);
      }

      // Focus on the message input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [newConversationId, newChatUserData, isMobile]);

  const handleCloseModal = useCallback(() => {
    setShowNewChatModal(false);
    setNewChatUserData(null);
    // Optionally navigate away or handle the close action
  }, []);

  return (
    <>
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">بدء محادثة جديدة</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingUserData ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-500">جاري تحميل بيانات المستخدم...</p>
                  </div>
                </div>
              ) : newChatUserData ? (
                <div className="text-center">
                  <div className="mb-4">
                    <img
                      src={newChatUserData.profilePic || `https://avatar.iran.liara.run/public/boy?username=${newConversationId}`}
                      alt={`${newChatUserData.firstName} ${newChatUserData.lastName}`}
                      className="w-20 h-20 rounded-full mx-auto object-cover shadow-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {`${newChatUserData.firstName} ${newChatUserData.lastName}`}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    هل تريد بدء محادثة مع "{`${newChatUserData.firstName} ${newChatUserData.lastName}`}"؟
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-6">
                    فشل في تحميل بيانات المستخدم
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-gray-50 flex gap-3">
              <Button
                onClick={handleCloseModal}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleStartConversation}
                disabled={loadingUserData || !newChatUserData}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                بدء المحادثة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex h-screen bg-gray-50/50 overflow-hidden" dir="rtl">
        {/* Sidebar - Conversations */}
        <div className={`${isMobile
          ? showSidebar ? 'fixed inset-0 z-50 bg-white' : 'hidden'
          : 'relative'
          } w-full md:w-96 lg:w-[400px] flex flex-col bg-white/95 backdrop-blur-sm border-l border-gray-200/70 shadow-sm`}>

          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">المحادثات</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchConversations}
                  disabled={conversationsLoading}
                  className="h-9 w-9 p-0 hover:bg-gray-100/70 rounded-full"
                >
                  {conversationsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-600" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100/70 rounded-full">
                  <Settings className="h-5 w-5 text-gray-600" />
                </Button>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(false)}
                    className="h-9 w-9 p-0 hover:bg-gray-100/70 rounded-full"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </Button>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث في المحادثات..."
                className="pl-10 pr-4 bg-gray-50/80 border-gray-200/70 rounded-full text-sm placeholder:text-gray-400 focus:bg-white focus:border-blue-300 transition-all duration-200 text-right"
              />
            </div>
          </div>

          {/* Error Alert */}
          {conversationsError && (
            <Alert className="m-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {conversationsError}
              </AlertDescription>
            </Alert>
          )}

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent">
            {conversationsLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <ConversationSkeleton key={i} />
              ))
            ) : filteredConversations.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center">
                  {searchQuery ? "لا توجد محادثات مطابقة" : "لا توجد محادثات"}
                </p>
              </div>
            ) : (
              // All Conversations
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation === conversation.id}
                  onClick={handleConversationClick}
                />
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">

                <div className="flex items-center gap-3">
                  <div className="relative">
                    {/* <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/50 ${currentConversation.type === 'group'
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-500'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-500'
                                        }`}>
                                        {currentConversation.avatar}
                                    </div> */}

                    <img
                      src={currentConversation.avatar || 'https://avatar.iran.liara.run/public' + currentConversation.name}
                      alt={currentConversation.name}
                      className={`w-11 h-11 rounded-full object-cover shadow-lg ring-2 ring-white/50  'bg-gradient-to-r from-blue-600 to-blue-500'
                                            }`}
                    />


                    {isUserOnline(currentConversation.id) && (
                      <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full">
                        <div className="w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-base text-right">
                      {currentConversation.name}
                    </h2>
                    <p className="text-sm text-emerald-600 font-medium flex items-center gap-1 justify-end">
                      {isUserOnline(currentConversation.id) ? (
                        <>
                          متصل الآن
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        </>
                      ) : (
                        <span className="text-gray-500">غير متصل</span>
                      )}
                    </p>
                  </div>


                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSidebar(true)}
                      className="h-9 w-9 p-0 hover:bg-gray-100/70 rounded-full"
                    >
                      <Menu className="h-5 w-5 text-gray-600" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent">
                {/* Loading indicator */}
                {isLoading && messages.length === 0 && (
                  <div className="flex justify-center items-center py-8">
                    <div className="flex gap-1.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce shadow-sm"
                          style={{ animationDelay: `${delay}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex justify-center">
                    <Alert className="max-w-md border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Empty messages state */}
                {!isLoading && !error && messages.length === 0 && (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">ابدأ محادثة جديدة</p>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => {
                  const isOwn = msg.senderId === currentUserId;

                  return (
                    <div
                      key={msg.id || i}
                      className={`flex ${isOwn ? "justify-start" : "justify-end"} mb-2`}
                    >
                      <div className={`max-w-[75%] lg:max-w-[60%] ${isOwn ? "order-1" : "order-2"}`}>
                        <div
                          className={`relative px-4 py-3 rounded-2xl shadow-md border transition-colors duration-200
                    ${isOwn
                              ? "bg-blue-600 text-white border-blue-500"
                              : "bg-white text-gray-800 border-gray-200"
                            }`}
                        >
                          {/* Message content */}
                          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-right">
                            {msg.content}
                          </p>

                          {/* Timestamp & status */}
                          <div
                            className={`text-xs mt-2 flex items-center gap-1 ${isOwn
                              ? "text-blue-100 justify-start"
                              : "text-gray-500 justify-end"
                              }`}
                          >
                            {isOwn && (
                              <CheckCheck className="h-3 w-3 text-blue-200" />
                            )}
                            <span>{formatMessageTime(msg.timestamp)}</span>
                          </div>

                          {/* Message tail */}

                        </div>
                      </div>
                    </div>
                  );
                })}




                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/95 backdrop-blur-xl border-t border-gray-200/50">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading}
                    className="h-12 w-12 p-0 shrink-0 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 disabled:from-blue-300 disabled:via-blue-300 disabled:to-blue-400 shadow-lg hover:shadow-xl disabled:shadow-sm transition-all duration-300 rounded-full group hover:scale- 0 disabled:scale-100 ring-2 ring-transparent hover:ring-blue-200/50 active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : (
                      <Send className="h-5 w-5 text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    )}
                  </Button>

                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="اكتب رسالتك هنا..."
                      disabled={isLoading}
                      className="min-h-[48px] bg-gray-50/90 hover:bg-gray-50 focus:bg-white border-gray-200/70 hover:border-gray-300/70 focus:border-blue-300 rounded-full px-5 py-3 pl-12 text-base placeholder:text-gray-400 transition-all duration-200 shadow-sm focus:shadow-md disabled:opacity-50 text-right"
                    />

                  </div>

                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">اختر محادثة</h3>
                <p className="text-gray-500">اختر محادثة من القائمة لبدء الدردشة</p>
                {isMobile && (
                  <Button
                    onClick={() => setShowSidebar(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    عرض المحادثات
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default ChatPage;