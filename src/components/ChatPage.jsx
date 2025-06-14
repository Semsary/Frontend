import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessageCircle, Send, Phone, Mail, Clock, User, Search, Settings, Menu, X, Loader2, CheckCheck, AlertCircle } from 'lucide-react';
import useChatStore from '../../../store/chat.store';
import axiosChat from '../../../config/api/axiosChat';
import useAuthStore from '../../../store/auth.store';

// Default users configuration
const DEFAULT_USERS = [
    {
        id: "CustomerService1",
        name: "خدمة العملاء",
        avatar: 'https://avatar.iran.liara.run/public/boy?username=خدمة العملاء',
        lastMessage: "مرحباً، كيف يمكنني مساعدتك؟",
        type: "support"
    },
    {
        id: "landlord3",
        name: "المدير",
        avatar: 'https://avatar.iran.liara.run/public/boy?username=المدير',
        lastMessage: "أهلاً وسهلاً بك",
        type: "admin"
    },
    {
        id: "sales1",
        name: "قسم المبيعات",
        avatar: 'https://avatar.iran.liara.run/public/girl?username=المبيعات',
        lastMessage: "كيف يمكنني مساعدتك في الشراء؟",
        type: "sales"
    }
];

const ChatPage = () => {
    // ...existing state management...
    const [activeConversation, setActiveConversation] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [conversationsError, setConversationsError] = useState("");

    // ...existing refs...
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const prevActiveConversationRef = useRef("");

    // ...existing store hooks...
    const { getUser } = useAuthStore();
    const currentUser = getUser();
    const currentUserId = currentUser?.id || "01JX9V1H7CD8TTMDF5RGETXRGB";

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

    // ...existing memoized values...
    const filteredConversations = useMemo(() => {
        return conversations.filter(conv =>
            conv.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [conversations, searchQuery]);

    const currentConversation = useMemo(() => {
        return conversations.find(conv => conv.id === activeConversation);
    }, [conversations, activeConversation]);

    // ...existing utility functions...
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

    // ...existing transform functions...
    const transformConversationsData = useCallback((apiConversations) => {
        if (!Array.isArray(apiConversations)) return [];

        return apiConversations.map((conv) => {
            const participantId = conv.otherParticipant || "landlord3";
            const defaultUser = DEFAULT_USERS.find(u => u.id === participantId);

            return {
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
            };
        }).sort((a, b) => b.timestamp - a.timestamp);
    }, []);

    // ...existing conversation management...
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

            const defaultConversations = DEFAULT_USERS.map(createDefaultUser);
            setConversations(defaultConversations);
        } finally {
            setConversationsLoading(false);
        }
    }, [transformConversationsData, createDefaultUser]);

    // ...existing event handlers...
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

    // ...existing effects...
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
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            updateConversationWithNewMessage(latestMessage);
        }
    }, [messages, updateConversationWithNewMessage]);

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

    // Enhanced render functions
    const renderLoadingSkeleton = () => (
        Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 mx-2 mb-3 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32" />
                        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48" />
                    </div>
                </div>
            </div>
        ))
    );

    const renderConversationItem = (conversation) => (
        <div
            key={conversation.id}
            onClick={() => handleConversationClick(conversation.id)}
            className={`p-4 mx-2 mb-3 cursor-pointer transition-all duration-300 bg-white rounded-xl shadow-sm border hover:shadow-md hover:scale-[1.02] transform ${activeConversation === conversation.id
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20'
                    : 'border-gray-100 hover:border-blue-200'
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                        <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                    {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4">
                            <div className="w-full h-full bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                    )}
                    {conversation.unreadCount > 0 && (
                        <div className="absolute -top-2 -left-2 min-w-[22px] h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg animate-bounce">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate text-sm transition-colors duration-200 ${activeConversation === conversation.id ? 'text-blue-700' : 'text-gray-900'
                            }`}>
                            {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {formatTime(conversation.timestamp)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1 leading-relaxed">
                            {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount === 0 && (
                            <CheckCheck className="h-4 w-4 text-blue-500 ml-2 opacity-70" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
            <div className="max-w-7xl mx-auto flex h-screen">

                {/* Enhanced Sidebar */}
                <div className={`${isMobile ? showSidebar ? 'fixed inset-0 z-50 bg-white' : 'hidden' : 'relative'} 
          w-full md:w-96 lg:w-[420px] flex flex-col bg-gradient-to-b from-white to-gray-50 backdrop-blur-lg border-l border-gray-200/50 shadow-2xl`}>

                    {/* Enhanced Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <MessageCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <h1 className="text-xl font-bold text-white drop-shadow-sm">المحادثات</h1>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={fetchConversations}
                                        disabled={conversationsLoading}
                                        className="h-10 w-10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                                    >
                                        {conversationsLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                                        ) : (
                                            <Settings className="h-5 w-5 text-white" />
                                        )}
                                    </button>
                                    {isMobile && (
                                        <button
                                            onClick={() => setShowSidebar(false)}
                                            className="h-10 w-10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
                                        >
                                            <X className="h-5 w-5 text-white" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced Search */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="البحث في المحادثات..."
                                    className="w-full pl-12 pr-4 py-3 bg-white/95 border border-white/30 rounded-2xl text-sm placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 text-right backdrop-blur-sm shadow-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Error Alert */}
                    {conversationsError && (
                        <div className="m-4 p-4 border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl flex items-center gap-3 shadow-sm">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="text-red-700 text-sm font-medium">{conversationsError}</span>
                        </div>
                    )}

                    {/* Enhanced Conversations List */}
                    <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                        {conversationsLoading ? (
                            renderLoadingSkeleton()
                        ) : filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <Search className="h-10 w-10 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-center font-medium">
                                    {searchQuery ? "لا توجد محادثات مطابقة" : "لا توجد محادثات"}
                                </p>
                            </div>
                        ) : (
                            filteredConversations.map(renderConversationItem)
                        )}
                    </div>

                    {/* Enhanced Contact Info */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200/50 backdrop-blur-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            طرق التواصل الأخرى
                        </h3>
                        <div className="space-y-3">
                            {[
                                { icon: Phone, text: "+20 123 456 789", color: "text-green-600" },
                                { icon: Mail, text: "support@company.com", color: "text-blue-600" },
                                { icon: Clock, text: "24/7 متاح", color: "text-purple-600" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors duration-200">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <item.icon size={16} className={item.color} />
                                    </div>
                                    <span className="text-gray-700 text-sm font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced Main Chat Area */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 backdrop-blur-sm">
                    {currentConversation ? (
                        <>
                            {/* Enhanced Chat Header */}
                            <div className="p-4 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {isMobile && (
                                            <button
                                                onClick={() => setShowSidebar(true)}
                                                className="h-10 w-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200"
                                            >
                                                <Menu className="h-5 w-5 text-gray-600" />
                                            </button>
                                        )}
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                                                <img
                                                    src={currentConversation.avatar}
                                                    alt={currentConversation.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {isUserOnline(currentConversation.id) && (
                                                <div className="absolute -bottom-1 -left-1 w-4 h-4">
                                                    <div className="w-full h-full bg-green-500 border-2 border-white rounded-full"></div>
                                                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-gray-900 text-lg">{currentConversation.name}</h2>
                                            <p className={`text-sm font-medium ${isUserOnline(currentConversation.id) ? 'text-green-600' : 'text-gray-500'}`}>
                                                {isUserOnline(currentConversation.id) ? (
                                                    <span className="flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        متصل الآن
                                                    </span>
                                                ) : 'غير متصل'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {isLoading && messages.length === 0 && (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-lg backdrop-blur-sm">
                                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                            <span className="text-gray-600 font-medium">جارِ التحميل...</span>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex justify-center">
                                        <div className="max-w-md p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center gap-3 shadow-lg">
                                            <AlertCircle className="h-5 w-5 text-red-600" />
                                            <span className="text-red-700 font-medium">{error}</span>
                                        </div>
                                    </div>
                                )}

                                {!isLoading && !error && messages.length === 0 && (
                                    <div className="flex justify-center items-center py-16">
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                                <MessageCircle className="h-12 w-12 text-blue-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-700 mb-2">ابدأ محادثة جديدة</h3>
                                            <p className="text-gray-500">اكتب رسالتك الأولى لبدء المحادثة</p>
                                        </div>
                                    </div>
                                )}

                                {messages.map((msg, i) => {
                                    const isOwn = msg.senderId === currentUserId;
                                    return (
                                        <div
                                            key={msg.id || i}
                                            className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
                                        >
                                            <div className={`max-w-[75%] lg:max-w-[60%] group`}>
                                                <div
                                                    className={`px-5 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${isOwn
                                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white transform hover:scale-[1.02]"
                                                        : "bg-white text-gray-800 border border-gray-200 hover:border-blue-200 backdrop-blur-sm"
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap font-medium">
                                                        {msg.content}
                                                    </p>
                                                    <div
                                                        className={`text-xs mt-3 flex items-center gap-2 ${isOwn ? "text-blue-100 justify-start" : "text-gray-500 justify-end"
                                                            }`}
                                                    >
                                                        {isOwn && <CheckCheck className="h-3 w-3 opacity-80" />}
                                                        <span className="bg-black/10 px-2 py-1 rounded-full">
                                                            {formatMessageTime(msg.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Enhanced Input Area */}
                            <div className="p-6 bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl">
                                <div className="flex items-end gap-4">
                                    <button
                                        onClick={handleSend}
                                        disabled={!message.trim() || isLoading}
                                        className="h-12 w-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:hover:scale-100"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Send className="h-5 w-5" />
                                        )}
                                    </button>

                                    <div className="flex-1">
                                        <input
                                            ref={inputRef}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="اكتب رسالتك هنا..."
                                            disabled={isLoading}
                                            className="w-full min-h-[50px] bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl px-6 py-4 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-right shadow-lg transition-all duration-200 hover:shadow-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="w-32 h-32 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                    <MessageCircle className="h-16 w-16 text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-3">اختر محادثة</h3>
                                <p className="text-gray-500 mb-6 max-w-md">اختر محادثة من القائمة لبدء الدردشة والتواصل</p>
                                {isMobile && (
                                    <button
                                        onClick={() => setShowSidebar(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                                    >
                                        عرض المحادثات
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #94a3b8, #64748b);
        }
      `}</style>
        </div>
    );
};

export default ChatPage;
