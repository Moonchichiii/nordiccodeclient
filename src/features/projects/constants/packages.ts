export const packages = [
  {
    id: 'static',
    title: 'Static Frontend',
    priceEUR: '600',
    priceSEK: '6,300',
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
    id: 'fullstack',
    title: 'Full Stack',
    priceEUR: '1,100',
    priceSEK: '11,200',
    recommended: true,
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
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    priceEUR: '2,000',
    priceSEK: '20,200',
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
]
