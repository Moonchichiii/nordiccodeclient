import { useState, useCallback } from 'react';

export const useTyping = (conversationId: string, ws: WebSocket | null) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const handleTypingStart = useCallback(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'typing_start',
        conversation_id: conversationId
      }));
    }
  }, [ws, conversationId]);

  const handleTypingEnd = useCallback(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'typing_end',
        conversation_id: conversationId
      }));
    }
  }, [ws, conversationId]);

  const handleTypingEvent = useCallback((data: { user: string; isTyping: boolean }) => {
    setTypingUsers(prev => {
      if (data.isTyping) {
        return prev.includes(data.user) ? prev : [...prev, data.user];
      }
      return prev.filter(user => user !== data.user);
    });
  }, []);

  return {
    typingUsers,
    handleTypingStart,
    handleTypingEnd,
    handleTypingEvent
  };
};