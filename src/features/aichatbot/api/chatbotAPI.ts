import axios from 'axios';
import { ChatbotResponse } from '@/features/aichatbot/types/chatbotTypes';

export const sendChatMessage = async (message: string): Promise<ChatbotResponse> => {
  const response = await axios.post('/api/chatbot/', { message });
  return response.data;
};
