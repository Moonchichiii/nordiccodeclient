import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, error, className, ...props }, ref) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400
                         group-focus-within:text-yellow-500/70 transition-colors duration-300" />
        )}
        <input
          ref={ref}
          className={`w-full bg-gray-800/50 text-white border rounded-xl py-2 
          ${Icon ? 'pl-10' : 'px-3'} pr-3 placeholder-gray-500 transition-all duration-300
          ${error 
            ? 'border-red-500/50 focus:border-red-500' 
            : 'border-gray-700/50 focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/20'
          } 
          ${className || ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
);

InputField.displayName = 'InputField';