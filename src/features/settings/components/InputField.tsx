import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, error, className, ...props }, ref) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-2.5 text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            flex h-10 w-full rounded-md border bg-background text-sm
            ring-offset-background placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${Icon ? "pl-10" : "px-3"}
            ${error 
              ? "border-destructive focus:ring-destructive" 
              : "border-input focus:ring-ring"
            }
            ${className || ""}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
);

InputField.displayName = 'InputField';