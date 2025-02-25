// Price utility (you can include additional price functions if needed)
export const parsePrice = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/,/g, ''));
};

export const toCents = (eur: number) => Math.round(eur * 100);
export const fromCents = (cents: number) => cents / 100;

// Validation logic (using zod)
import { z } from 'zod';

export const validateProjectRequest = (data: unknown) => {
  const schema = z.object({
    packageId: z.string(),
    addonIds: z.array(z.string()),
    draft: z.boolean().optional(),
  });
  return schema.parse(data);
};