import { PackageData } from '@/features/projects/types/types';

export const packages: PackageData[] = [
  {
    type: 'static',
    name: 'Static Frontend',
    priceEUR: 600,
    priceSEK: 6300,
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
  },
  {
    type: 'fullstack',
    name: 'Full Stack',
    priceEUR: 1100,
    priceSEK: 11200,
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
  },
  {
    type: 'enterprise',
    name: 'Enterprise',
    priceEUR: 2000,
    priceSEK: 20200,
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
  },
];
