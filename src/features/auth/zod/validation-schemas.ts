const passwordSchema = z.string()
  .min(8, 'Must be 8+ characters')
  .regex(/[A-Z]/, 'Need uppercase')
  .regex(/[a-z]/, 'Need lowercase')
  .regex(/[0-9]/, 'Need number')
  .regex(/[^A-Za-z0-9]/, 'Need special char')

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short')
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password1: passwordSchema,
  password2: passwordSchema,
  full_name: z.string()
    .min(2, 'Name too short')
    .regex(/^[a-zA-Z\s]+$/, 'Letters only'),
  phone_number: z.string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid format'),
  street_address: z.string().min(3, 'Address too short'),
  city: z.string().min(2, 'City required'),
  postal_code: z.string().min(3, 'Invalid code'),
  country: z.string().length(2, 'Use country code'),
  accepted_terms: z.literal(true, {
    errorMap: () => ({ message: 'Must accept terms' })
  }),
  marketing_consent: z.boolean().default(false),
  vat_number: z.string().max(50).optional()
}).refine(data => data.password1 === data.password2, {
  message: "Passwords must match",
  path: ["password2"]
})