import { Addon } from '@/features/projects/types/types';

export const addons: Addon[] = [
  {
    id: 'seo',
    title: 'Advanced SEO Package',
    description: 'Enhanced SEO optimization including keyword research, meta optimization, and sitemap generation',
    priceEUR: 300,
    priceSEK: 3100,
    compatible: ['static', 'fullstack', 'enterprise'],
  },
  {
    id: 'analytics',
    title: 'Analytics Integration',
    description: 'Custom analytics dashboard with user behavior tracking and conversion metrics',
    priceEUR: 250,
    priceSEK: 2600,
    compatible: ['fullstack', 'enterprise'],
  },
  {
    id: 'maintenance',
    title: 'Extended Maintenance',
    description: '3 months of additional maintenance and support after the initial support period',
    priceEUR: 400,
    priceSEK: 4200,
    compatible: ['static', 'fullstack', 'enterprise'],
  },
  {
    id: 'cdn',
    title: 'Global CDN Setup',
    description: 'Content delivery network configuration for faster global access',
    priceEUR: 200,
    priceSEK: 2100,
    compatible: ['fullstack', 'enterprise'],
  },
];

export const enterpriseIncludedAddons = ['analytics', 'seo', 'maintenance', 'cdn'];
