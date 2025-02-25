import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm
                   text-foreground placeholder:text-muted-foreground appearance-none
                   focus:outline-none focus:ring-2 focus:ring-primary/50
                   hover:border-primary/50 transition-colors pr-8"
        >
          <option value="" className="text-muted-foreground">Select</option>
          {options.map(opt => (
            <option 
              key={opt.value} 
              value={opt.value} 
              className="text-foreground bg-background py-1"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};

export default SelectInput;