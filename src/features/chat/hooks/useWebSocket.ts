import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '../types/chat';

interface WebSocketHookResult {
  isConnected: boolean;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const useWebSocket = (
  conversationId: string,
  currentUserEmail: string
): WebSocketHookResult => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connectWebSocket = useCallback(() => {
    wsRef.current = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/chat/${conversationId}/`
    );

    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch(data.type) {
          case 'message':
            setMessages(prev => [...prev, data]);
            break;
          case 'messages_read':
            setMessages(prev => prev.map(msg => 
              data.message_ids.includes(msg.id) 
                ? {...msg, is_read: true} 
                : msg
            ));
            break;
          case 'error':
            console.error('WebSocket error:', data.error);
            break;
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };
  }, [conversationId]);

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || !attachments.length)) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        if (attachments?.length) {
          const formData = new FormData();
          formData.append('content', content);
          attachments.forEach(file => {
            formData.append('attachments', file);
          });

          const response = await fetch(
            `/api/project-messages/${conversationId}/send-message/`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!response.ok) throw new Error('Failed to send message');
        } else {
          wsRef.current.send(JSON.stringify({
            type: 'message',
            message: content
          }));
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('WebSocket is not connected');
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  return {
    isConnected,
    sendMessage,
    messages,
    setMessages
  };
};