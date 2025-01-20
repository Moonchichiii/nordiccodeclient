import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionButtonProps {
  active: boolean;
  icon: LucideIcon;
  children: React.ReactNode;
  onClick: () => void;
}

export const SectionButton: React.FC<SectionButtonProps> = ({ 
  active, 
  icon: Icon, 
  children, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 w-full p-3 rounded-xl transition-all duration-200
      ${active 
        ? 'bg-yellow-500/10 text-yellow-500' 
        : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
      }`}
  >
    <Icon className="h-5 w-5" />
    <span>{children}</span>
  </button>
);