import { ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
  projectTitle: string;
  isConnected: boolean;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  projectTitle,
  isConnected,
  onBack
}) => (
  <div className="flex items-center px-6 py-4 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50">
    {onBack && (
      <button
        onClick={onBack}
        className="p-2 mr-4 hover:bg-gray-700/50 rounded-xl transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
      </button>
    )}
    <div>
      <h2 className="text-lg font-semibold text-white">{projectTitle}</h2>
      <div className="flex items-center text-sm">
        <span className={`h-2 w-2 rounded-full mr-2 ${
          isConnected ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
        }`} />
        <span className="text-gray-400">
          {isConnected ? 'Connected' : 'Reconnecting...'}
        </span>
      </div>
    </div>
  </div>
);
