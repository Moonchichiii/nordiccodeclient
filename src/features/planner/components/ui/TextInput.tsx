import React from 'react';

interface TextInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, placeholder, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
      />
    </div>
  );
};

export default TextInput;
