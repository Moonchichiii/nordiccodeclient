import React, { useRef, useState } from 'react';
import { Paperclip, Send, X, Loader } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (content: string, files?: File[]) => Promise<void>;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  onTypingStart,
  onTypingEnd,
}) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !files.length) return;

    try {
      setIsUploading(true);
      await onSubmit(message, files);
      setMessage('');
      setFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    event.target.value = ''; // Reset input
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicators
    onTypingStart?.();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTypingEnd?.();
    }, 2000);
  };

  return (
    <div className="p-4 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50">
      {/* File previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 
                       rounded-lg text-sm text-gray-200"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => removeFile(file)}
                className="p-1 hover:bg-gray-600/50 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-gray-400 hover:text-yellow-500 
                   hover:bg-gray-700/50 rounded-xl transition-all duration-200"
          disabled={isUploading}
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type your message..."
          disabled={isUploading}
          className="flex-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 
                   rounded-xl text-white placeholder-gray-400 focus:outline-none 
                   focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/20 
                   transition-all duration-200 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={(!message.trim() && !files.length) || isUploading}
          className="p-2.5 bg-yellow-500 text-gray-900 rounded-xl hover:bg-yellow-400
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all 
                   duration-200 hover:shadow-lg hover:shadow-yellow-500/20 
                   transform hover:-translate-y-0.5"
        >
          {isUploading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};