import React from 'react';

interface TextInputProps {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ 
  label, 
  value, 
  placeholder, 
  required, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm
                 text-foreground placeholder:text-muted-foreground
                 focus:outline-none focus:ring-2 focus:ring-primary/50
                 hover:border-primary/50 transition-colors"
      />
    </div>
  );
};

export default TextInput;