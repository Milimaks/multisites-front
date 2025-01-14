// Not use yet in the project

import { useState } from "react";
import { chatService } from "~/services/chatService";
import { Message } from "~/types/types";

export function useChat(conversationId: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState(initialMessages);

  const sendMessage = async (content: string, userId: string) => {
    const newMessage = {
      id: messages.length + 1,
      content,
      sender: { id: userId },
    };
    setMessages((prev) => [...prev, newMessage]);

    // Uncomment this code when the chatService is implemented
    // This code is uneccessary due to useFetcher and the route action instead

    // try {
    //   await chatService.sendMessage(conversationId, content);
    // } catch (error) {
    //   console.error("Failed to send message", error);
    // }
  };

  return { messages, sendMessage };
}
