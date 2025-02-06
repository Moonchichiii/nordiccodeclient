import React from 'react';

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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="space-y-1">
        {options.map(opt => (
          <label key={opt} className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => handleToggle(opt)}
              className="form-checkbox text-yellow-500"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
