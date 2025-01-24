import { Lock } from 'lucide-react';
import { lazy, Suspense } from 'react';

const Messages = () => {
  const isChatEnabled = false; // Always false for now

  if (!isChatEnabled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] max-w-md mx-auto text-center p-6">
        <Lock className="h-12 w-12 text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Chat Unavailable</h2>
        <p className="text-gray-400">
          Chat access will be enabled after:
        </p>
        <ul className="text-sm text-gray-400 mt-4 space-y-2">
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
            Project package selection
          </li>
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
            Initial payment completion
          </li>
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
            Project planning phase completion
          </li>
        </ul>
      </div>
    );
  }

  // Only import and use Chat when enabled
  const Chat = lazy(() => import('@/pages/chat/Chat'));
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chat />
    </Suspense>
  );
};

export default Messages;