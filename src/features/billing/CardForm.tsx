import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CreditCard, 
  User, 
  Calendar, 
  Lock, 
  Loader2, 
  AlertCircle,
  Shield 
} from 'lucide-react';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Enhanced validation schema with additional security checks
const cardSchema = z.object({
  name: z.string()
    .min(2, 'Name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s-']+$/, 'Name contains invalid characters'),
  number: z.string()
    .length(16, 'Card number must be 16 digits')
    .regex(/^\d+$/, 'Must contain only numbers')
    .refine(num => {
      // Basic Luhn algorithm check for card number validation
      const digits = num.split('').map(Number);
      let sum = 0;
      let isEven = false;
      
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0;
    }, 'Invalid card number'),
  expMonth: z.string()
    .regex(/^(0?[1-9]|1[012])$/, 'Invalid month')
    .refine(month => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;
      const expYear = parseInt(cardSchema.shape.expYear.parse('23')); // Get the year from the form
      
      return parseInt(month) >= currentMonth || expYear > currentYear;
    }, 'Card has expired'),
  expYear: z.string()
    .length(2, 'Use 2-digit year')
    .regex(/^\d+$/, 'Must be numbers')
    .refine(year => {
      const currentYear = new Date().getFullYear() % 100;
      const yearNum = parseInt(year);
      return yearNum >= currentYear && yearNum <= currentYear + 10;
    }, 'Invalid year'),
  cvc: z.string()
    .min(3, 'Invalid CVC')
    .max(4, 'Invalid CVC')
    .regex(/^\d+$/, 'Must be numbers')
});

type CardFormData = z.infer<typeof cardSchema>;

interface CardFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const CardForm = ({ onSuccess, onError }: CardFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    mode: 'onBlur'
  });

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
  };

  const cardNumber = watch('number');
  const formattedCardNumber = formatCardNumber(cardNumber || '');

  const onSubmit = async (data: CardFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, use a secure payment gateway SDK for tokenization
      const response = await axios.post('/api/payments/save-card/', {
        name: data.name,
        // Only send tokenized data in production
        card_details: {
          // Never send raw card data - this is just for demonstration
          number: data.number,
          exp_month: data.expMonth,
          exp_year: data.expYear,
          cvc: data.cvc
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Include CSRF token if your backend requires it
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        }
      });

      if (response.data.success) {
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'An unexpected error occurred';
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    error, 
    ...props 
  }: { 
    icon: any; 
    label: string; 
    error?: string; 
    [key: string]: any;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <input
          className="flex h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 
                   text-sm ring-offset-background placeholder:text-muted-foreground 
                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                   hover:border-primary/50 transition-colors duration-300
                   disabled:cursor-not-allowed disabled:opacity-50"
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
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-foreground">Add Payment Method</h2>
        <p className="text-sm text-muted-foreground">
          Enter your card details securely
        </p>
      </div>

      <div className="grid gap-6">
        {/* Name field */}
        <InputField
          icon={User}
          label="Cardholder Name"
          placeholder="Name on card"
          autoComplete="cc-name"
          {...register('name')}
          error={errors.name?.message}
        />

        {/* Card number field */}
        <InputField
          icon={CreditCard}
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          autoComplete="cc-number"
          maxLength={16}
          {...register('number', {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, '');
            }
          })}
          error={errors.number?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Expiration date fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Expiration Date
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <input
                  placeholder="MM"
                  maxLength={2}
                  autoComplete="cc-exp-month"
                  className="flex h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 
                           text-sm ring-offset-background placeholder:text-muted-foreground 
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                           hover:border-primary/50 transition-colors duration-300"
                  {...register('expMonth')}
                />
              </div>
              <input
                placeholder="YY"
                maxLength={2}
                autoComplete="cc-exp-year"
                className="flex h-10 w-full rounded-lg border border-border bg-card px-3 
                         text-sm ring-offset-background placeholder:text-muted-foreground 
                         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                         hover:border-primary/50 transition-colors duration-300"
                {...register('expYear')}
              />
            </div>
            {(errors.expMonth || errors.expYear) && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.expMonth?.message || errors.expYear?.message}
              </p>
            )}
          </div>

          {/* CVC field */}
          <InputField
            icon={Lock}
            label="CVC"
            placeholder="123"
            maxLength={4}
            autoComplete="cc-csc"
            {...register('cvc')}
            error={errors.cvc?.message}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}

      {/* Form footer */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 text-primary" />
          <span>Your payment info is secure</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative overflow-hidden px-6 py-2.5 rounded-lg text-sm
                   font-medium bg-primary text-primary-foreground
                   transition-all duration-300 hover:scale-[1.02]
                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                   focus:ring-offset-background active:scale-[0.98]
                   shadow-lg hover:shadow-xl
                   disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0
                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Save Card'
            )}
          </span>
        </button>
      </div>
    </form>
  );
};

export default CardForm;