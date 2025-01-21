import React, { useRef } from 'react';
import { Paperclip, Send } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileSelect: (files: File[]) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSubmit,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={onSubmit} className="p-4 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50">
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
              onFileSelect(Array.from(e.target.files));
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
  );
};