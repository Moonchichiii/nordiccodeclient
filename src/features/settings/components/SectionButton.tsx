import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

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
    className={`
      group relative flex items-center gap-3 w-full p-3 rounded-xl
      transition-all duration-300 overflow-hidden
      ${active 
        ? 'bg-primary/10 text-primary' 
        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
      }
    `}
  >
    {/* Animated background gradient */}
    <div className={`
      absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent
      transition-opacity duration-500 opacity-0 group-hover:opacity-100
      ${active ? 'opacity-100' : ''}
      animate-gradient-x
    `} />

    {/* Icon with animations */}
    <div className={`
      relative flex items-center justify-center w-8 h-8 rounded-lg
      transition-all duration-300 transform
      ${active 
        ? 'bg-primary/20 scale-100' 
        : 'bg-muted/50 group-hover:scale-110'
      }
    `}>
      <Icon className={`
        h-4 w-4 transition-all duration-300
        ${active 
          ? 'text-primary scale-100 rotate-0' 
          : 'text-muted-foreground group-hover:text-foreground group-hover:scale-110 group-hover:-rotate-12'
        }
      `} />
    </div>

    {/* Text with animations */}
    <span className={`
      relative font-medium text-sm transition-all duration-300 transform
      ${active 
        ? 'translate-x-0' 
        : 'group-hover:translate-x-1'
      }
    `}>
      {children}
    </span>

    {/* Active indicator dot */}
    <div className={`
      absolute right-3 w-1.5 h-1.5 rounded-full
      transition-all duration-300 transform
      ${active 
        ? 'bg-primary scale-100 opacity-100' 
        : 'bg-transparent scale-0 opacity-0'
      }
    `} />
  </button>
);
