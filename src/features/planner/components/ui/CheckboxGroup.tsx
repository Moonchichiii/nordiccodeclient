import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selected, onChange }) => {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map(opt => (
          <label
            key={opt}
            className={`
              group relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer
              overflow-hidden transition-all duration-300 hover:shadow-md
              ${selected.includes(opt)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent/5'}
            `}
          >
            <div className={`
              w-5 h-5 rounded-md border flex items-center justify-center
              transition-colors duration-300
              ${selected.includes(opt)
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border group-hover:border-primary/50'}
            `}>
              <input
                type="checkbox"
                className="sr-only"
                checked={selected.includes(opt)}
                onChange={() => handleToggle(opt)}
              />
              {selected.includes(opt) && <Check className="w-3 h-3" />}
            </div>
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {opt}
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;