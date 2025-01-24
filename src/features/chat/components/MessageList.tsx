import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';
import { Message } from '../types/chat.types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface MessageListProps {
  messages: Message[];
  currentUserEmail: string;
  typingUsers: string[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserEmail,
  typingUsers,
  hasMore,
  isLoading,
  onLoadMore
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: onLoadMore,
    enabled: hasMore && !isLoading,
  });

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Handle initial scroll and new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll events to determine auto-scroll behavior
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      setShouldAutoScroll(isNearBottom);
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {/* Load more messages indicator */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoading ? (
            <Loader className="h-6 w-6 animate-spin text-gray-400" />
          ) : (
            <div className="text-sm text-gray-400">Load more messages...</div>
          )}
        </div>
      )}

      {/* Grouped messages */}
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <span className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
              {date === new Date().toLocaleDateString() ? 'Today' : date}
            </span>
          </div>
          
          {dateMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender_email === currentUserEmail}
            />
          ))}
        </div>
      ))}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="pb-2">
          <TypingIndicator userNames={typingUsers} />
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />

      {/* New messages indicator */}
      {!shouldAutoScroll && messages.length > 0 && (
        <button
          onClick={() => {
            setShouldAutoScroll(true);
            scrollToBottom();
          }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 
                     bg-yellow-500 text-gray-900 px-4 py-2 rounded-full 
                     shadow-lg hover:bg-yellow-400 transition-colors"
        >
          New messages
        </button>
      )}
    </div>
  );
};