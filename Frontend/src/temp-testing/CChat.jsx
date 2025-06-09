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

// Mock data for conversations - fallback when API fails
const mockConversations = [
    {
        id: "CustomerService1",
        name: "CustomerService1",
        avatar: "أ",
        lastMessage: "سأرسل لك التفاصيل قريباً",
        timestamp: Date.now() - 60000,
        unreadCount: 0,
        isOnline: true,
        isPinned: true,
        type: "direct"
    },
    {
        id: "01JX9V1H7CD8TTMDF5RGETXRGB",
        name: "admin",
        avatar: "س",
        lastMessage: "شكراً لك على الاجتماع اليوم",
        timestamp: Date.now() - 180000,
        unreadCount: 3,
        isOnline: true,
        isPinned: false,
        type: "direct"
    },
    {
        id: "3",
        name: "فريق التطوير",
        avatar: "ف",
        lastMessage: "تم رفع النسخة الجديدة",
        timestamp: Date.now() - 300000,
        unreadCount: 12,
        isOnline: false,
        isPinned: true,
        type: "group"
    }
];

const ChatPage = () => {
    const [activeConversation, setActiveConversation] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [conversationsError, setConversationsError] = useState("");

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const prevActiveConversationRef = useRef("");

    // Get current user ID - replace with actual logic to get current user
    const currentUserId = "CustomerService1";

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
        clearMessages
    } = useChatStore();

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

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        try {
            setConversationsLoading(true);
            setConversationsError("");
            const response = await axiosChat.get("/messages/conversations");

            if (response.data && Array.isArray(response.data)) {
                setConversations(response.data);
            } else {
                // Fallback to mock data if API response is invalid
                setConversations(mockConversations);
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            setConversationsError("فشل في تحميل المحادثات");
            // Use mock data as fallback
            setConversations(mockConversations);
        } finally {
            setConversationsLoading(false);
        }
    }, []);

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
            await sendMessage({
                senderId: currentUserId,
                receiverId: activeConversation,
                content: message.trim()
            });

            inputRef.current?.focus();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [message, activeConversation, currentUserId, isLoading, sendMessage]);

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

    const isUserOnline = useCallback((userId) => {
        return onlineUsers.has(userId);
    }, [onlineUsers]);

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

    const ConversationItem = React.memo(({ conversation, isActive, onClick }) => (
        <div
            onClick={() => onClick(conversation.id)}
            className={`relative p-4 cursor-pointer transition-all duration-200 border-b border-gray-100/50 hover:bg-gray-50/70 ${isActive ? 'bg-blue-50/80 border-l-4 border-l-blue-500 shadow-sm' : ''
                }`}
        >
            {conversation.isPinned && (
                <Pin className="absolute top-2 right-2 h-3 w-3 text-blue-500" />
            )}

            <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${conversation.type === 'group'
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}>
                        {conversation.avatar}
                    </div>
                    {isUserOnline(conversation.id) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -left-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate text-sm ${isActive ? 'text-blue-700' : 'text-gray-900'
                            }`}>
                            {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">
                            {formatTime(conversation.timestamp)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">
                            {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount === 0 && (
                            <CheckCheck className="h-4 w-4 text-blue-500 shrink-0 ml-2" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    ));

    return (
        <div className="flex h-screen bg-gray-50/50 overflow-hidden">
            {/* Sidebar - Conversations */}
            <div className={`${isMobile
                    ? showSidebar ? 'fixed inset-0 z-50 bg-white' : 'hidden'
                    : 'relative'
                } w-full md:w-96 lg:w-[400px] flex flex-col bg-white/95 backdrop-blur-sm border-r border-gray-200/70 shadow-sm`}>

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
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="البحث في المحادثات..."
                            className="pr-10 bg-gray-50/80 border-gray-200/70 rounded-full text-sm placeholder:text-gray-400 focus:bg-white focus:border-blue-300 transition-all duration-200"
                            style={{ direction: "rtl" }}
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
                        <>
                            {/* Pinned Conversations */}
                            {filteredConversations.filter(conv => conv.isPinned).length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50/50 sticky top-0 backdrop-blur-sm">
                                        المثبتة
                                    </div>
                                    {filteredConversations
                                        .filter(conv => conv.isPinned)
                                        .map((conversation) => (
                                            <ConversationItem
                                                key={conversation.id}
                                                conversation={conversation}
                                                isActive={activeConversation === conversation.id}
                                                onClick={handleConversationClick}
                                            />
                                        ))
                                    }
                                </div>
                            )}

                            {/* Regular Conversations */}
                            <div>
                                {filteredConversations.filter(conv => conv.isPinned).length > 0 && (
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50/50 sticky top-0 backdrop-blur-sm">
                                        الكل
                                    </div>
                                )}
                                {filteredConversations
                                    .filter(conv => !conv.isPinned)
                                    .map((conversation) => (
                                        <ConversationItem
                                            key={conversation.id}
                                            conversation={conversation}
                                            isActive={activeConversation === conversation.id}
                                            onClick={handleConversationClick}
                                        />
                                    ))
                                }
                            </div>
                        </>
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

                                <div className="relative">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/50 ${currentConversation.type === 'group'
                                            ? 'bg-gradient-to-r from-purple-600 to-purple-500'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-500'
                                        }`}>
                                        {currentConversation.avatar}
                                    </div>
                                    {isUserOnline(currentConversation.id) && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full">
                                            <div className="w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-900 text-base">
                                        {currentConversation.name}
                                    </h2>
                                    <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                                        {isUserOnline(currentConversation.id) ? (
                                            <>
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                متصل الآن
                                            </>
                                        ) : (
                                            <span className="text-gray-500">غير متصل</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200 rounded-full">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-full">
                                    <Video className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 rounded-full">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
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
                                        className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-3 duration-500`}
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className={`max-w-[75%] lg:max-w-[65%] ${isOwn ? "order-2" : "order-1"}`}>
                                            <div
                                                className={`group relative px-4 py-3 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] ${isOwn
                                                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white ml-2 shadow-blue-200/50"
                                                        : "bg-white/95 backdrop-blur-sm text-gray-800 mr-2 border border-gray-100/70 shadow-gray-200/30"
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                                    {msg.content}
                                                </p>
                                                <div className={`text-xs mt-1.5 flex items-center gap-1 ${isOwn ? "text-blue-100/90 justify-end" : "text-gray-500 justify-start"
                                                    }`}>
                                                    <span>{formatMessageTime(msg.timestamp)}</span>
                                                    {isOwn && (
                                                        <CheckCheck className="h-3 w-3 text-blue-200/80" />
                                                    )}
                                                </div>

                                                {/* Message tail */}
                                                <div
                                                    className={`absolute top-4 w-0 h-0 transition-all duration-300 group-hover:scale-110 ${isOwn
                                                            ? "-right-1 border-l-8 border-l-blue-500 border-t-4 border-b-4 border-t-transparent border-b-transparent"
                                                            : "-left-1 border-r-8 border-r-white border-t-4 border-b-4 border-t-transparent border-b-transparent"
                                                        }`}
                                                ></div>
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
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 w-10 p-0 shrink-0 hover:bg-gray-100/70 transition-all duration-200 rounded-full hover:scale-110"
                                >
                                    <Paperclip className="h-5 w-5 text-gray-500" />
                                </Button>

                                <div className="flex-1 relative">
                                    <Input
                                        ref={inputRef}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="اكتب رسالتك هنا..."
                                        disabled={isLoading}
                                        className="min-h-[48px] bg-gray-50/90 hover:bg-gray-50 focus:bg-white border-gray-200/70 hover:border-gray-300/70 focus:border-blue-300 rounded-full px-5 py-3 pr-12 text-base placeholder:text-gray-400 transition-all duration-200 shadow-sm focus:shadow-md disabled:opacity-50"
                                        style={{ direction: "rtl" }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100/70 transition-all duration-200 rounded-full hover:scale-110"
                                    >
                                        <Smile className="h-4 w-4 text-gray-500" />
                                    </Button>
                                </div>

                                <Button
                                    onClick={handleSend}
                                    disabled={!message.trim() || isLoading}
                                    className="h-12 w-12 p-0 shrink-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 shadow-lg hover:shadow-xl disabled:shadow-sm transition-all duration-300 rounded-full group hover:scale-110 disabled:scale-100 ring-2 ring-transparent hover:ring-blue-200/50 active:scale-95"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5 text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                                    )}
                                </Button>
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
    );
};

export default ChatPage;