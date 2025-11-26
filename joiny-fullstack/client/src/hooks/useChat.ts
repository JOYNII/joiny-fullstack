// import { useState, useEffect, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { User } from '../types';
// import { ChatMessage } from '../app/party/[id]/components/Chat';
// import { QueryClient } from '@tanstack/react-query';

// export function useChat(partyId: string, currentUser: User, queryClient: QueryClient) {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     if (!partyId) return;

//     const socket = io("http://localhost:3001");
//     socketRef.current = socket;

//     socket.emit("join_room", partyId);

//     socket.on("receive_message", (message: ChatMessage) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     socket.on("refetch_party_data", () => {
//       console.log("Received refetch signal. Invalidating queries.");
//       queryClient.invalidateQueries({ queryKey: ['party', partyId] });
//       queryClient.invalidateQueries({ queryKey: ['parties'] });
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [partyId, queryClient]);

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newMessage.trim() === '' || !socketRef.current) return;

//     const message: ChatMessage = {
//       user: currentUser,
//       text: newMessage,
//       timestamp: new Date().toISOString(),
//     };

//     socketRef.current.emit('send_message', { partyId, message });
//     setNewMessage('');
//   };

//   return { messages, newMessage, setNewMessage, handleSendMessage, socketRef };
// }
