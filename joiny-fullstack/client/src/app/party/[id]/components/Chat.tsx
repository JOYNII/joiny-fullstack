
import React from "react";
import { User } from "../../../../types";

export interface ChatMessage {
  user: User;
  text: string;
  timestamp: string;
}

interface ChatProps {
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  currentUser: User;
}

export default function Chat({ messages, newMessage, setNewMessage, handleSendMessage, currentUser }: ChatProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md space-y-4">
      <h3 className="text-xl font-bold text-gray-800">파티 채팅</h3>
      <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.user.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.user.id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <div className="font-bold text-sm">{msg.user.name}</div>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
          전송
        </button>
      </form>
    </div>
  );
}
