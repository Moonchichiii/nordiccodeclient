import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ConversationProps } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useWebSocket } from '../../hooks/useWebSocket';

const MessageInterface: React.FC<ConversationProps> = ({
  projectTitle = "Project Discussion",
  conversationId,
  currentUserEmail,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    sendMessage,
    messages,
    setMessages
  } = useWebSocket(conversationId, currentUserEmail);

  const fetchMessages = async () => {
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
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleFileSelect = (files: File[]) => {
    sendMessage(newMessage, files);
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
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

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.sender_email === currentUserEmail}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSubmit={handleSubmit}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};

export default MessageInterface;