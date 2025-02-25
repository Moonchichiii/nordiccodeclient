// src/features/projects/constants/packages.ts
import { PackageData } from '../types/types';

// Constants matching backend
export const PACKAGE_TYPES = {
  STATIC: 'static',
  FULLSTACK: 'fullstack',
  ENTERPRISE: 'enterprise',
} as const;

// Helper functions for price conversion
const eurToCents = (eur: number) => Math.round(eur * 100);
const sekToOre = (sek: number) => Math.round(sek * 100);

// Updated packages with both display and backend prices
export const packages: PackageData[] = [
  {
    type: PACKAGE_TYPES.STATIC,
    name: 'Static Frontend',
    // Frontend display prices
    priceEUR: 600,
    priceSEK: 6300,
    // Backend prices in cents/ore
    priceEURCents: eurToCents(600),
    priceSEKOre: sekToOre(6300),
    description: 'Modern TypeScript-based front end with responsive design and basic on-page SEO.',
    features: [
      'Modern TypeScript-based front end',
      'Responsive & mobile-friendly design',
      'Basic on-page SEO optimization',
    ],
    extraFeatures: [
      'Professional developer-built React / TypeScript application',
      'Vite-based build for speed & modern tooling',
      '14 days of developer support',
    ],
    recommended: false,
    supportDays: 14,
  },
  {
    type: PACKAGE_TYPES.FULLSTACK,
    name: 'Full Stack',
    priceEUR: 1100,
    priceSEK: 11200,
    priceEURCents: eurToCents(1100),
    priceSEKOre: sekToOre(11200),
    description: 'Includes everything in Static Frontend plus Django-based back end and database integration.',
    features: [
      'Everything in Static Frontend',
      'Django-based back end',
      'Database integration & API endpoints',
    ],
    extraFeatures: [
      'Secure authentication (session-based)',
      'Admin dashboard & management tools',
      '30 days developer support',
    ],
    recommended: true,
    supportDays: 30,
  },
  {
    type: PACKAGE_TYPES.ENTERPRISE,
    name: 'Enterprise',
    priceEUR: 2000,
    priceSEK: 20200,
    priceEURCents: eurToCents(2000),
    priceSEKOre: sekToOre(20200),
    description: 'All features of Full Stack plus advanced security, cloud infrastructure, and premium support.',
    features: [
      'Everything in Full Stack',
      'Advanced security & authentication',
      'Cloud infrastructure & deployment',
    ],
    extraFeatures: [
      'High-performance database optimization',
      'Load balancing configuration',
      '45 days premium support',
      'CI/CD pipeline setup',
    ],
    recommended: false,
    supportDays: 45,
  },
];

// Type guard to ensure package data consistency
export const validatePackageData = (pkg: PackageData): boolean => {
  return (
    pkg.priceEURCents === eurToCents(pkg.priceEUR) &&
    pkg.priceSEKOre === sekToOre(pkg.priceSEK) &&
    pkg.type in PACKAGE_TYPES
  );
};

// Helper function to get display price from cents
export const formatPrice = (cents: number, currency: 'EUR' | 'SEK'): string => {
  const amount = cents / 100;
  return currency === 'EUR' ? `€${amount}` : `${amount} SEK`;
};