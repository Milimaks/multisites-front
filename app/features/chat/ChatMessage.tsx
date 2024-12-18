import React from "react";
import { format } from "date-fns";

interface ChatMessageProps {
  content: string;
  isOwn: boolean;
  avatar?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isOwn,
  avatar,
}) => {
  return (
    <div
      className={`flex ${
        isOwn ? "flex-row-reverse" : "flex-row"
      } items-end gap-2 mb-4`}
    >
      {!isOwn && (
        <img
          src={
            avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
          }
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div
        className={`flex flex-col ${
          isOwn ? "items-end" : "items-start"
        } max-w-[70%]`}
      >
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-100 text-gray-900 rounded-bl-none"
          }`}
        >
          <p className="text-sm">{content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1"></span>
      </div>
    </div>
  );
};
