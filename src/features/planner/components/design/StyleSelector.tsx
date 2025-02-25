// src/features/planner/components/design/StyleSelector.tsx
import React from 'react';
import { Minimize2, Paintbrush2, Briefcase, Sparkles, Crown, Code2 } from 'lucide-react';

interface StyleOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface StyleSelectorProps {
  selected: string;
  onChange: (style: string) => void;
}

const styleOptions: StyleOption[] = [
  { id: 'minimal', name: 'Minimal & Clean', icon: Minimize2, description: 'Simple, elegant, and uncluttered design' },
  { id: 'modern', name: 'Modern & Bold', icon: Paintbrush2, description: 'Contemporary with striking visuals' },
  { id: 'professional', name: 'Classic & Professional', icon: Briefcase, description: 'Traditional and business-focused' },
  { id: 'playful', name: 'Playful & Creative', icon: Sparkles, description: 'Fun and engaging interactions' },
  { id: 'luxury', name: 'Luxury & Elegant', icon: Crown, description: 'Sophisticated and high-end' },
  { id: 'technical', name: 'Technical & Functional', icon: Code2, description: 'Feature-rich and efficient' },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {styleOptions.map((style) => {
        const Icon = style.icon;
        const isSelected = selected === style.id;
        return (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            className={`group relative p-4 rounded-xl border transition-all duration-300 ${
              isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  isSelected ? 'bg-primary/20 text-primary' : 'bg-accent text-muted-foreground group-hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {style.name}
                </h4>
                <p className="text-sm text-muted-foreground">{style.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StyleSelector;
