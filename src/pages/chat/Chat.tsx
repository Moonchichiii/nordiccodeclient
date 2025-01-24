import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Paperclip, X } from 'lucide-react';

import { chatApi } from '@/features/chat/api/chat.api';
import { useWebSocket } from '@/features/chat/hooks/useWebSocket';
import { useTyping } from '@/features/chat/hooks/useTyping';
import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { ChatHeader } from '@/features/chat/components/ChatHeader';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  // WebSocket setup
  const { isConnected, sendMessage } = useWebSocket(conversationId as string);
  const { typingUsers, handleTypingStart, handleTypingEnd } = useTyping(
    conversationId as string,
    null
  );

  // Queries and mutations
  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => chatApi.fetchProjectConversations().then(
      convs => convs.find(c => c.id === conversationId)
    ),
    enabled: !!conversationId
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatApi.fetchConversationMessages(conversationId as string),
    enabled: !!conversationId
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ content, files }: { content: string; files?: File[] }) =>
      chatApi.sendMessage(conversationId as string, content, files),
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', conversationId], 
        (oldMessages = []) => [...oldMessages, newMessage]
      );
      setNewMessage('');
      setFiles([]);
    }
  });

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      chatApi.markAsRead(conversationId);
    }
  }, [conversationId, messages.length]);

  const handleSubmit = async () => {
    if (!newMessage.trim() && !files.length) return;

    try {
      await sendMessageMutation.mutateAsync({
        content: newMessage,
        files
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-400">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <ChatHeader
        projectTitle={conversation.project_title}
        isConnected={isConnected}
        onBack={() => navigate('/dashboard/messages')}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex ${message.sender_email === user?.email ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] rounded-lg p-3 ${
              message.sender_email === user?.email
                ? 'bg-yellow-500 text-gray-900' 
                : 'bg-gray-800 text-white'
            }`}>
              <div className="text-sm mb-1 opacity-75">
                {message.sender_name}
              </div>
              <div className="break-words">{message.content}</div>
              {message.attachments?.map((file) => (
                <div key={file.id} className="mt-2 text-sm flex items-center space-x-2">
                  <Paperclip className="h-4 w-4" />
                  <span>{file.file_name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4 bg-gray-900">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-800 rounded px-2 py-1 text-sm">
                <span>{file.name}</span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="file"
            id="file-input"
            className="hidden"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          <label
            htmlFor="file-input"
            className="p-2 text-gray-400 hover:text-yellow-500 cursor-pointer"
          >
            <Paperclip className="h-5 w-5" />
          </label>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTypingStart();
            }}
            onBlur={handleTypingEnd}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2
                     text-white placeholder-gray-400 focus:outline-none 
                     focus:border-yellow-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />

          <button
            onClick={handleSubmit}
            disabled={!newMessage.trim() && !files.length}
            className="p-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;