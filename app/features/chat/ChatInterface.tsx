import { useFetcher } from "@remix-run/react";
import { Info, Phone, Video } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export interface Message {
  id: number;
  content: string;
  sender: { id: string };
}

function chatInterface({
  conversation,
  userId,
}: {
  conversation: any;
  userId: string;
}) {
  const fetcherSendMessage = useFetcher();
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (content: string) => {
    // Optimistically add the message to the UI before sending it to the server
    const newMessage: Message = {
      id: messages.length + 1,
      content,
      sender: { id: userId },
    };
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      return updatedMessages;
    });

    // Scroll to bottom
    scrollToBottom();

    // Send the message to the server
    fetcherSendMessage.submit(
      {
        content,
        conversationId: conversation.id,
      },
      {
        method: "post",
        action: `/chat/${conversation.id}`,
      }
    );
  };

  return (
    <div className="flex h-[85dvh] bg-gray-100">
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
              <h2 className="font-semibold">
                {conversation.users[1].firstName}
              </h2>
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message: any) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              userId={userId}
              senderId={message.sender?.id}
              avatar={
                !message.isOwn
                  ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
                  : undefined
              }
            />
          ))}
          {/* Scroll to bottom after each message post */}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          conversationId={conversation.id}
        />
      </div>
    </div>
  );
}

export default chatInterface;
