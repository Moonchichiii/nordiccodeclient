import { useState } from 'react';
import { ChatMessage, ChatbotResponse } from '@/features/aichatbot/types/chatbotTypes';
import { sendChatMessage } from '@/features/aichatbot/api/chatbotAPI';

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    // Append the user message first
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    setError(null);

    try {
      const response: ChatbotResponse = await sendChatMessage(content);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setError('Error sending message');
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, error };
};
