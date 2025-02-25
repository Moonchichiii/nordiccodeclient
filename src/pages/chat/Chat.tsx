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
        <div className="animate-pulse text-muted-foreground">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
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
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card border border-border text-foreground'
            }`}>
              <div className={`text-sm mb-1 ${
                message.sender_email === user?.email
                  ? 'text-primary-foreground/75'
                  : 'text-muted-foreground'
              }`}>
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
      <div className="border-t border-border p-4 bg-background/80 backdrop-blur-sm">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 bg-card border border-border rounded-lg px-2 py-1 text-sm">
                <span className="text-foreground">{file.name}</span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-muted-foreground hover:text-destructive transition-colors"
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
            className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
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
            className="flex-1 bg-card border border-border rounded-lg px-4 py-2
                     text-foreground placeholder:text-muted-foreground 
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                     hover:border-primary/50 transition-colors duration-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />

          <button
            onClick={handleSubmit}
            disabled={!newMessage.trim() && !files.length}
            className="p-2 bg-primary text-primary-foreground rounded-lg 
                     transition-all duration-300 hover:scale-[1.02]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                     active:scale-[0.98] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0
                         translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            <Send className="h-5 w-5 relative" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;