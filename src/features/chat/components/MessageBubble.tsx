import React from 'react';
import { Paperclip } from 'lucide-react';
import { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-xl p-4 shadow-lg backdrop-blur-sm
          ${isCurrentUser
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
  );
};