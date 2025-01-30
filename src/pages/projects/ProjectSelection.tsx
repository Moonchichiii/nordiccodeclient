import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Code, Laptop, LucideIcon } from 'lucide-react';

interface Package {
  id: 'static' | 'mid_tier' | 'enterprise';
  name: string;
  icon: LucideIcon;
  priceEUR: number;
  priceSEK: number;
  features: string[];
}

const packages: Package[] = [
  {
    id: 'static',
    name: 'Static Frontend Solution',
    icon: Package,
    priceEUR: 1500,
    priceSEK: 6300,
    features: [
      'Professional developer-built React application',
      'Custom responsive design implementation',
      'Modern build setup with Vite',
      'Performance optimization',
      'Basic SEO configuration',
      '14 days developer support',
    ],
  },
  {
    id: 'mid_tier',
    name: 'Mid-Tier Solution',
    icon: Laptop,
    priceEUR: 3500,
    priceSEK: 11200,
    features: [
      'Everything in Static Frontend',
      'Custom Django REST API development',
      'Secure database architecture',
      'User authentication system',
      'Admin dashboard & management tools',
      '30 days developer support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Full-Stack Solution',
    icon: Code,
    priceEUR: 7000,
    priceSEK: 20200,
    features: [
      'Complete enterprise solution',
      'Advanced security implementation',
      'High-performance database optimization',
      'Load balancing configuration',
      'CI/CD pipeline setup',
      '45 days premium support',
    ],
  },
];

const ProjectSelection = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const navigate = useNavigate();

  const handlePackageSelect = async (pkg: Package) => {
    setSelectedPackage(pkg);
    try {
      const response = await fetch('/api/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package: pkg.id,
          title: `New ${pkg.name} Project`,
          status: 'planning',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/dashboard/planner/${data.id}`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-8">Select Your Professional Development Package</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon;

          return (
            <button
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg)}
              className="flex flex-col p-6 rounded-xl bg-gray-800/50 border border-gray-700/50
                         hover:border-yellow-500/50 hover:bg-gray-800/80 transition-all duration-300"
            >
              <Icon className="h-8 w-8 mb-4 text-yellow-500" />
              <h3 className="text-lg font-medium mb-2">{pkg.name}</h3>
              <p className="text-2xl font-bold mb-4">
                €{pkg.priceEUR.toLocaleString()} / SEK{pkg.priceSEK.toLocaleString()}
              </p>

              <ul className="mt-auto space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectSelection;