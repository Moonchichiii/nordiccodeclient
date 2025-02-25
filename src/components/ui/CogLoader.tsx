import React from 'react';
import { Cog } from 'lucide-react';

const CogLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-3">
    <Cog className="w-8 h-8 animate-spin text-blue-500" />
    <p className="text-sm text-gray-600 font-medium">Loading preview...</p>
  </div>
);

export default CogLoader;