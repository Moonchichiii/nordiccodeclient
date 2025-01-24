interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
   }
   
   export const Button = ({
    variant = 'primary',
    size = 'md',
    children,
    onClick,
    disabled
   }: ButtonProps) => {
    const baseStyles = "rounded-lg font-medium transition-all duration-200 focus:outline-none";
    
    const variants = {
      primary: "bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:opacity-50",
      secondary: "bg-gray-700 text-white hover:bg-gray-600",
      outline: "border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
    };
   
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg"
    };
   
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
   };
   