import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard } from 'lucide-react'
import axios from 'axios'

// Validation schema
const cardSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  number: z.string()
    .min(16, 'Card number must be 16 digits')
    .max(16, 'Card number must be 16 digits')
    .regex(/^\d+$/, 'Must contain only numbers'),
  expMonth: z.string()
    .min(1, 'Required')
    .max(2, 'Invalid month')
    .regex(/^(0?[1-9]|1[012])$/, 'Invalid month'),
  expYear: z.string()
    .length(2, 'Use 2-digit year')
    .regex(/^\d+$/, 'Must be numbers'),
  cvc: z.string()
    .min(3, 'Invalid CVC')
    .max(4, 'Invalid CVC')
    .regex(/^\d+$/, 'Must be numbers')
})

type CardFormData = z.infer<typeof cardSchema>

interface CardFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

const CardForm = ({ onSuccess, onError }: CardFormProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    mode: 'onBlur'
  })

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || ''
  }

  const cardNumber = watch('number')
  const formattedCardNumber = formatCardNumber(cardNumber || '')

  const onSubmit = async (data: CardFormData) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/payments/save-card/', {
        name: data.name,
        // Only send tokenized/encrypted data in production
        card_details: {
          number: data.number,
          exp_month: data.expMonth,
          exp_year: data.expYear,
          cvc: data.cvc
        }
      })

      if (response.data.success) {
        onSuccess?.()
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        onError?.(error.response.data.message || 'Failed to save card')
      } else {
        onError?.('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Card Name */}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">
          Cardholder Name
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          placeholder="Name on card"
          autoComplete="cc-name"
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Card Number */}
      <div className="space-y-1">
        <label htmlFor="number" className="text-sm font-medium text-gray-300">
          Card Number
        </label>
        <div className="relative">
          <input
            {...register('number')}
            type="text"
            id="number"
            placeholder="1234 5678 9012 3456"
            autoComplete="cc-number"
            maxLength={16}
            className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              e.target.value = value
              return register('number').onChange(e)
            }}
          />
          <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.number && (
          <p className="text-red-500 text-xs">{errors.number.message}</p>
        )}
      </div>

      {/* Exp Date and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">
            Expiration Date
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              {...register('expMonth')}
              type="text"
              placeholder="MM"
              maxLength={2}
              autoComplete="cc-exp-month"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <input
              {...register('expYear')}
              type="text"
              placeholder="YY"
              maxLength={2}
              autoComplete="cc-exp-year"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          {(errors.expMonth || errors.expYear) && (
            <p className="text-red-500 text-xs">
              {errors.expMonth?.message || errors.expYear?.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="cvc" className="text-sm font-medium text-gray-300">
            CVC
          </label>
          <input
            {...register('cvc')}
            type="text"
            id="cvc"
            placeholder="123"
            maxLength={4}
            autoComplete="cc-csc"
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          {errors.cvc && (
            <p className="text-red-500 text-xs">{errors.cvc.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-lg text-sm font-medium 
                 transition-all duration-300 flex items-center justify-center gap-2
                 bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:opacity-50"
      >
        {isLoading ? 'Saving Card...' : 'Save Card'}
      </button>
    </form>
  )
}

export default CardForm