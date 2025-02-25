export type PackageType = 'static' | 'fullstack' | 'enterprise';

interface PricingData {
  priceEUR: number;
  priceSEK: number;
  priceEURCents: number;
  priceSEKOre: number;
}

export interface PackageData extends PricingData {
  type: PackageType;
  name: string;
  description: string;
  features: string[];
  extraFeatures: string[];
  recommended?: boolean;
  supportDays: number;
  isActive?: boolean;
}

export interface Addon extends PricingData {
  id: string;
  title: string;
  description: string;
  compatible: PackageType[];
  isActive?: boolean;
}

export const toCents = (eur: number) => Math.round(eur * 100);
export const toOre = (sek: number) => Math.round(sek * 100);
export const fromCents = (cents: number) => cents / 100;
export const fromOre = (ore: number) => ore / 100;

export const validatePricing = (data: PricingData): boolean => {
  return (
    data.priceEURCents === toCents(data.priceEUR) &&
    data.priceSEKOre === toOre(data.priceSEK)
  );
};

export const formatPrice = (
  amount: number,
  currency: 'EUR' | 'SEK',
  useSmallestUnit: boolean = false
): string => {
  const value = useSmallestUnit ? fromCents(amount) : amount;
  return currency === 'EUR'
    ? `€${value.toFixed(2)}`
    : `${value.toFixed(2)} SEK`;
};