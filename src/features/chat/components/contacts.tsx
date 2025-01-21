import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_name: string;
  sender_email: string;
  created_at: string;
  is_read: boolean;
  has_attachment: boolean;
  attachments: Array<{
    id: string;
    file_name: string;
    file_type: string;
  }>;
}

interface ConversationProps {
  projectTitle?: string;
  conversationId: string;
  currentUserEmail: string;
  onBack?: () => void;
}

const MessageInterface: React.FC<ConversationProps> = ({
  projectTitle = "Project Discussion",
  conversationId,
  currentUserEmail,
  onBack
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/project-messages/${conversationId}/`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // WebSocket connection management
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
      // Attempt to reconnect after 3 seconds
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

  useEffect(() => {
    fetchMessages();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [fetchMessages, connectWebSocket]);

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || !attachments.length)) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        // If there are attachments, use FormData and REST API
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
          // For text-only messages, use WebSocket
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

  const markMessagesAsRead = useCallback((messageIds: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mark_read',
        message_ids: messageIds
      }));
    }
  }, []);

  useEffect(() => {
    if (messages.length) {
      const unreadMessages = messages
        .filter(msg => !msg.is_read && msg.sender_email !== currentUserEmail)
        .map(msg => msg.id);
      
      if (unreadMessages.length) {
        markMessagesAsRead(unreadMessages);
      }
    }
  }, [messages, currentUserEmail, markMessagesAsRead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-500"></div>
    </div>;
  }
  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {projectTitle}
            </h2>
            <p className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Reconnecting...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_email === currentUserEmail ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-xl p-4 shadow-lg backdrop-blur-sm
                ${message.sender_email === currentUserEmail
                  ? 'bg-yellow-500/90 text-gray-900'
                  : 'bg-gray-800/90 text-white'
                } border border-gray-700/50`}
            >
              <div className="text-sm font-medium mb-1 opacity-80">
                {message.sender_name}
              </div>
              <p className="text-sm">{message.content}</p>
              {message.has_attachment && (
                <div className="mt-2 space-y-1.5">
                  {message.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center space-x-2 text-sm bg-black/20 rounded-lg p-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="truncate">{attachment.file_name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs mt-2 opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleFileClick}
            className="p-2.5 text-gray-400 hover:text-yellow-500 hover:bg-gray-700/50 rounded-xl transition-all duration-200"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                sendMessage(newMessage, Array.from(e.target.files));
                setNewMessage('');
              }
            }}
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl 
                 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                 focus:ring-yellow-500/20 focus:border-yellow-500/20 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 bg-yellow-500 text-gray-900 rounded-xl hover:bg-yellow-400 
                 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                 hover:shadow-lg hover:shadow-yellow-500/20 transform hover:-translate-y-0.5"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInterface;
