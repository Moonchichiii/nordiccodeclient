import axios from '@/lib/axios';
import { Message, ProjectConversation } from '../types/chat.types';

export const chatApi = {
  fetchProjectConversations: async (): Promise<ProjectConversation[]> => {
    const response = await axios.get('/api/contacts/conversations/');
    return response.data;
  },

  fetchConversationMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await axios.get(`/api/contacts/conversations/${conversationId}/messages/`);
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string, attachments?: File[]) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('conversation', conversationId);
    
    if (attachments) {
      attachments.forEach(file => formData.append('files', file));
    }

    const response = await axios.post('/api/contacts/messages/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  markAsRead: async (conversationId: string) => {
    return axios.post(`/api/contacts/conversations/${conversationId}/mark-read/`);
  }
};