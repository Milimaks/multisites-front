// Not use yet in the project

export const chatService = {
  sendMessage: async (conversationId: string, content: string) => {
    const response = await fetch(`/chat/${conversationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: new URLSearchParams({
        content,
      }),
    });
    return response.json();
  },
};
