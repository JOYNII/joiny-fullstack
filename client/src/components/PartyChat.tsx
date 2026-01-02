'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import { getCurrentUser } from '../utils/api';

interface ChatMessage {
    user_name: string;
    message: string;
    sid: string;
    timestamp?: number | string;
}

interface PartyChatProps {
    partyId: string;
    isFullScreen?: boolean;
}

export default function PartyChat({ partyId, isFullScreen = false }: PartyChatProps) {
    const { socket, isConnected } = useSocket('/chat');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(isFullScreen); // Default open if full screen
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUser = getCurrentUser();

    // Focus input on mount
    useEffect(() => {
        if (!socket) return;
        if (!currentUser) return;

        // Join the chat room for this party
        socket.emit('join_party', { party_id: partyId, user_id: currentUser.id });

        socket.on('chat_history', (history: ChatMessage[]) => {
            setMessages(history);
            // Scroll to bottom after loading history
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), 100);
        });

        socket.on('chat_message', (data: ChatMessage) => {
            setMessages((prev) => [...prev, { ...data, timestamp: data.timestamp || Date.now() }]);
        });

        return () => {
            socket.off('chat_message');
            socket.off('chat_history');
            socket.emit('leave_party', { party_id: partyId });
        };
    }, [socket, partyId, currentUser]); // Added currentUser to dependencies

    // Focus input on mount
    useEffect(() => {
        if (isOpen) {
            // Small timeout to ensure DOM is ready
            setTimeout(() => {
                const input = document.getElementById('chat-input');
                input?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket || !currentUser) return;

        socket.emit('chat_message', {
            party_id: partyId,
            message: inputValue,
            user_name: currentUser.name,
            user_id: currentUser.id,
        });

        setInputValue('');
        // Keep focus
        document.getElementById('chat-input')?.focus();
    };

    if (!isOpen && !isFullScreen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
            </button>
        );
    }

    return (
        <div className={`flex flex-col bg-white border-gray-200 z-20 overflow-hidden
            ${isFullScreen
                ? 'w-full h-full shadow-none border-none'
                : 'absolute bottom-4 right-4 w-80 rounded-lg shadow-xl border max-h-[600px]'
            }`}
        >
            {/* Header */}
            <div className={`flex justify-between items-center p-4 border-b bg-white/80 backdrop-blur-md shadow-sm z-10 ${!isFullScreen && 'rounded-t-lg'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} title={isConnected ? "연결됨" : "연결 끊김"}></div>
                    <span className="font-bold text-gray-800 text-lg">Chat ({messages.length})</span>
                </div>
                {!isFullScreen && (
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        <span className="text-sm font-medium">No messages yet. Start the conversation!</span>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.user_name === currentUser.name;
                        // Show name only if previous message was not from same user (simplified check)
                        const showName = idx === 0 || messages[idx - 1].user_name !== msg.user_name;

                        return (
                            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {!isMe && showName && (
                                    <div className="flex items-center gap-2 mb-1 ml-1">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                            {msg.user_name[0]}
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">{msg.user_name}</span>
                                    </div>
                                )}
                                <div className={`relative px-4 py-2 text-sm shadow-sm max-w-[85%] break-words leading-relaxed ${isMe
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm'
                                    }`}>
                                    {msg.message}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex gap-2 items-center">
                    <input
                        id="chat-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || !isConnected}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md active:scale-95 flex items-center justify-center transform group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform">
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
