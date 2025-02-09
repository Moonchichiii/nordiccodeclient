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
      <div className="space-y-2">
        {options.map(opt => (
          <label
            key={opt}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div
              className={`h-4 w-4 rounded border transition-colors ${
                selected.includes(opt)
                  ? 'bg-primary border-primary'
                  : 'border-input hover:border-primary/50'
              } flex items-center justify-center`}
            >
              {selected.includes(opt) && (
                <Check className="h-3 w-3 text-primary-foreground" />
              )}
            </div>
            <span className="text-sm text-foreground">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;