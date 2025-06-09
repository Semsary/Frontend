import React, { useEffect, useRef } from "react";
import { Send, Smile, Phone, Video, MoreVertical, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useChatStore from "./../store/chat.store";
import { useForm } from "react-hook-form";

const ChatBox = ({ currentUserId, receiverId, receiverName = "محادثة", receiverAvatar, receiverPosition = "مدير المشاريع", onBack }) => {
    const {
        messages,
        sendMessage,
        fetchMessages,
        setupSocketConnection,
    } = useChatStore();

    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            message: ""
        }
    });
    const messageContent = watch("message");

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        fetchMessages(currentUserId, receiverId);
        const cleanup = setupSocketConnection(currentUserId);

        return () => {
            if (cleanup) cleanup();
        };
    }, [currentUserId, receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onSubmit = ({ message }) => {
        if (message.trim()) {
            sendMessage({ senderId: currentUserId, receiverId, content: message });
            reset();
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('ar-SA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="flex flex-col h-full bg-white border rounded-lg overflow-hidden shadow-sm">
            {/* Header with back button and user info */}
            <div className="flex flex-col border-b">
                <div className="flex items-center p-4 space-x-4">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-9 w-9"
                            onClick={onBack}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={receiverAvatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                {receiverName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{receiverName}</h3>
                            <p className="text-xs text-gray-500 truncate">{receiverPosition}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                            <Phone className="h-5 w-5 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                            <Video className="h-5 w-5 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                            <MoreVertical className="h-5 w-5 text-gray-600" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <p className="text-sm">ابدأ المحادثة مع {receiverName}</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isOwn = msg.senderId === currentUserId;
                        const showAvatar = !isOwn && (i === 0 || messages[i - 1].senderId !== msg.senderId);
                        const showDate = i === 0 ||
                            new Date(msg.timestamp).toDateString() !==
                            new Date(messages[i - 1].timestamp).toDateString();

                        return (
                            <React.Fragment key={i}>
                                {showDate && (
                                    <div className="flex justify-center my-4">
                                        <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                                            {formatDate(msg.timestamp)}
                                        </div>
                                    </div>
                                )}

                                <div className={`flex ${isOwn ? "justify-end" : "justify-start"} gap-3`}>
                                    {showAvatar && !isOwn && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarImage src={receiverAvatar} />
                                            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                                {receiverName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    {!showAvatar && !isOwn && <div className="w-8"></div>}

                                    <div className={`max-w-[80%] ${isOwn ? "order-2" : "order-1"}`}>
                                        <div
                                            className={`relative px-4 py-2 rounded-lg ${isOwn
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-800 border shadow-xs"
                                                }`}
                                        >
                                            <p className="text-sm" style={{ direction: msg.content.match(/[\u0600-\u06FF]/) ? 'rtl' : 'ltr' }}>
                                                {msg.content}
                                            </p>
                                            <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                                                {formatTime(msg.timestamp || Date.now())}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Container */}
            <div className="p-3 border-t bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Smile className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 relative">
                        <Input
                            {...register("message")}
                            onKeyDown={handleKeyPress}
                            placeholder="اكتب رسالتك هنا..."
                            className="rounded-full bg-gray-100 border-none focus:bg-gray-200 pr-12 focus-visible:ring-1 focus-visible:ring-blue-300"
                            style={{ direction: "rtl" }}
                        />
                    </div>

                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        disabled={!messageContent?.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;