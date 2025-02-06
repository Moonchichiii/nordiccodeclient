import React from 'react';

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
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
      >
        <option value="">Select</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
