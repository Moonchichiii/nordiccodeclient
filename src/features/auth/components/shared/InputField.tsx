import React, { ForwardedRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  error?: string;
  label: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, error, label, ...props }, ref: ForwardedRef<HTMLInputElement>) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground-alt">{label}</label>
      <div className="relative group">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-alt
            group-focus-within:text-primary transition-colors duration-300"
        />
        <input
          ref={ref}
          {...props}
          className={`w-full bg-background-alt/50 text-foreground border rounded-full py-2.5 pl-10 pr-4
            placeholder:text-foreground-alt/50 transition-all duration-300
            ${error 
              ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/10'
              : 'border-primary/10 focus:border-primary/30 focus:ring-2 focus:ring-primary/10'}`}
        />
      </div>
      {error && (
        <p className="text-destructive text-sm pl-3">{error}</p>
      )}
    </div>
  )
);

InputField.displayName = 'InputField';

export default InputField;