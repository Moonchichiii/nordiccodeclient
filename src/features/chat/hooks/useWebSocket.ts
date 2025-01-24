import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '../types/chat.types';
import { chatApi } from '../api/chat.api';

interface WebSocketState {
  isConnected: boolean;
  messages: Message[];
  typingUsers: string[];
}

export const useWebSocket = (conversationId: string) => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    messages: [],
    typingUsers: []
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    wsRef.current = new WebSocket(
      `${protocol}//${window.location.host}/ws/chat/${conversationId}/`
    );

    wsRef.current.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true }));
    };

    wsRef.current.onclose = () => {
      setState(prev => ({ ...prev, isConnected: false }));
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'message':
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, { ...data.message, status: 'delivered' }]
          }));
          break;
          
        case 'typing_start':
          setState(prev => ({
            ...prev,
            typingUsers: [...new Set([...prev.typingUsers, data.user])]
          }));
          break;
          
        case 'typing_end':
          setState(prev => ({
            ...prev,
            typingUsers: prev.typingUsers.filter(user => user !== data.user)
          }));
          break;
          
        case 'message_status':
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === data.message_id 
                ? { ...msg, status: data.status }
                : msg
            )
          }));
          break;
      }
    };

    return () => {
      wsRef.current?.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId]);

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && !attachments?.length) return;

    try {
      const message = { content, status: 'sending', timestamp: new Date().toISOString() };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));

      if (attachments?.length) {
        // Handle file uploads with progress
        const response = await chatApi.sendMessage(conversationId, content, attachments);
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg === message ? { ...response, status: 'delivered' } : msg
          )
        }));
      } else {
        // Send regular message via WebSocket
        wsRef.current?.send(JSON.stringify({
          type: 'message',
          content,
        }));
      }
    } catch (error) {
      // Update message status to failed
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg === message ? { ...msg, status: 'failed' } : msg
        )
      }));
      throw error;
    }
  };

  const sendTypingStatus = (isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: isTyping ? 'typing_start' : 'typing_end'
      }));

      if (isTyping && typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          sendTypingStatus(false);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return {
    ...state,
    sendMessage,
    sendTypingStatus
  };
};