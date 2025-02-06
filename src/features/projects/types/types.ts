export type PackageType = 'static' | 'fullstack' | 'enterprise';

export interface PackageData {
  type: PackageType;
  name: string;
  priceEUR: number;
  priceSEK: number;
  features: string[];
  extraFeatures: string[];
  recommended?: boolean;
}

export interface Addon {
  id: string;
  title: string;
  description: string;
  priceEUR: number;
  priceSEK: number;
  compatible: PackageType[];
}
