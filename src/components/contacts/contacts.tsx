import React, { useState, useEffect, useRef, useCallback } from 'react';

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
}

const MessageInterface = ({
    projectTitle = "Project Discussion",
    conversationId,
    currentUserEmail,
}: ConversationProps) => {
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
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
              {/* Header */}
              <div className="flex items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {projectTitle}
                  </h2>
                </div>
              </div>
        
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_email === currentUserEmail ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.sender_email === currentUserEmail
                          ? 'bg-brand-primary-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {message.sender_name}
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.has_attachment && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center text-sm text-gray-100 dark:text-gray-300"
                            >
                              <svg 
                                className="w-4 h-4 mr-1" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                              </svg>
                              <span>{attachment.file_name}</span>
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
              <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <svg 
                      className="w-5 h-5" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        onSendMessage(newMessage, Array.from(e.target.files));
                        setNewMessage('');
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-brand-primary-500 text-white rounded-lg hover:bg-brand-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg 
                      className="w-5 h-5" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          );
        };
    
export default MessageInterface;