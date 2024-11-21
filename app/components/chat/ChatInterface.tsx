import React, { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Phone, Video, Info } from "lucide-react";

interface Message {
  id: number;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hey! How's it going?",
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
  },
  {
    id: 2,
    content: "I'm doing great! Just finished that project we talked about.",
    timestamp: new Date(Date.now() - 3500000),
    isOwn: true,
  },
  {
    id: 3,
    content: "That's awesome! Would love to see it sometime.",
    timestamp: new Date(Date.now() - 3400000),
    isOwn: false,
  },
];

function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      content,
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col flex-1 max-w-4xl mx-auto bg-white shadow-xl">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
              alt="Contact"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold">John Doe</h2>
              <p className="text-sm text-green-500">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isOwn={message.isOwn}
              avatar={
                !message.isOwn
                  ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
                  : undefined
              }
            />
          ))}
        </div>

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;
