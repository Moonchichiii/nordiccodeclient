interface TypingIndicatorProps {
    userNames: string[];
  }
  
  export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userNames }) => {
    const getText = () => {
      if (userNames.length === 1) return `${userNames[0]} is typing...`;
      if (userNames.length === 2) return `${userNames[0]} and ${userNames[1]} are typing...`;
      return 'Several people are typing...';
    };
  
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span>{getText()}</span>
      </div>
    );
  };