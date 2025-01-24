import React from 'react';
import { Paperclip, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Message } from '../types/chat.types';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'sending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={clsx(
      "flex gap-2 mb-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      <div className={clsx(
        "max-w-[70%] rounded-xl p-4 shadow-lg backdrop-blur-sm",
        isCurrentUser 
          ? "bg-yellow-500/90 text-gray-900 ml-12" 
          : "bg-gray-800/90 text-white mr-12",
        "border border-gray-700/50"
      )}>
        <div className="flex justify-between items-start mb-1">
          <span className="text-sm font-medium opacity-80">
            {message.sender_name}
          </span>
          {isCurrentUser && (
            <div className="ml-2">
              {getStatusIcon()}
            </div>
          )}
        </div>

        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {message.has_attachment && (
          <div className="mt-2 space-y-1.5">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center space-x-2 text-sm bg-black/20 rounded-lg p-2 hover:bg-black/30 transition-colors cursor-pointer"
              >
                <Paperclip className="h-4 w-4 flex-shrink-0" />
                <span className="truncate flex-1">{attachment.file_name}</span>
                {attachment.file_size && (
                  <span className="text-xs opacity-70">
                    {Math.round(attachment.file_size / 1024)}KB
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs opacity-70">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {message.is_read && isCurrentUser && (
            <span className="text-xs opacity-70">Seen</span>
          )}
        </div>
      </div>
    </div>
  );
};