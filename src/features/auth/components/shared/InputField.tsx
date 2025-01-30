import React, { ForwardedRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ElementType;
    error?: string;
    label: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ icon: Icon, error, label, ...props }, ref: ForwardedRef<HTMLInputElement>) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="relative group">
                <Icon
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400
                             group-focus-within:text-yellow-500/70 transition-colors duration-300"
                />
                <input
                    ref={ref}
                    {...props}
                    className={`w-full bg-gray-800/50 text-white border rounded-lg py-2 pl-8 pr-2.5 
                    placeholder-gray-500 transition-all duration-300 text-sm
                    ${error ? 'border-red-500/50 focus:border-red-500'
                           : 'border-gray-700/50 focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/20'}`}
                />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    )
);

InputField.displayName = 'InputField';

export default InputField;