// src/features/planner/components/design/FeatureCard.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full p-4 rounded-xl border text-left transition-all duration-300 ${
        selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
            selected ? 'bg-primary/20 text-primary' : 'bg-accent text-muted-foreground group-hover:text-primary'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {title}
            </h4>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors duration-300 ${
                selected ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
              }`}
            >
              {selected && <Check className="w-3 h-3" />}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default FeatureCard;
