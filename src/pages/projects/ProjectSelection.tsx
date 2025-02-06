import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

import { usePackages } from '@/features/projects/hooks/usePackages';
import AddonsSelection from './AddonsSelection';
import { PackageData } from '@/features/projects/types/types';

const ProjectSelection: React.FC = () => {
  const navigate = useNavigate();
  const { packages, createProject, isPending } = usePackages();

  // We use package "type" as the unique identifier and later add projectId
  const [selectedPackage, setSelectedPackage] = useState<PackageData & { projectId?: number } | null>(null);
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [showAddons, setShowAddons] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const toggleFeatures = (pkgType: string) => {
    setIsOpen((prev) => ({ ...prev, [pkgType]: !prev[pkgType] }));
  };

  const handlePackageSelect = async (pkg: PackageData) => {
    setIsCreating(true);
    try {
      // Call createProject and log the response for debugging.
      const projectResponse = await createProject.mutateAsync(pkg.type);
      console.log("Created project response:", projectResponse);
      if (!projectResponse.id) {
        throw new Error("Project ID not returned from API");
      }
      // Merge the returned project id into the selected package
      setSelectedPackage({
        ...pkg,
        projectId: projectResponse.id,
      });
      setShowAddons(true);
    } catch (err: any) {
      console.error('Project creation error:', err.response?.data || err);
      toast.error(err.response?.data?.detail || 'Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (showAddons && selectedPackage) {
    return (
      <AddonsSelection
        selectedPackage={selectedPackage}
        onBack={() => setShowAddons(false)}
      />
    );
  }

  const isLoading = isPending || isCreating;

  return (
    <main className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-light mb-10 text-white">
        Select Your Professional Development Package
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.type}
            className="relative p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all duration-300"
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-500 text-gray-900 px-3 py-px rounded-full text-xs font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </span>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-light text-white">{pkg.name}</h3>
                <PriceDisplay priceEUR={pkg.priceEUR} priceSEK={pkg.priceSEK} />
              </div>
              <Features
                features={pkg.features}
                extraFeatures={pkg.extraFeatures}
                isOpen={isOpen[pkg.type]}
                onToggle={() => toggleFeatures(pkg.type)}
              />
              <button
                onClick={() => handlePackageSelect(pkg)}
                disabled={isLoading}
                className="group w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 hover:bg-yellow-400 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Select Package
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

// Inline components for PriceDisplay and Features (or you can move these to your components folder)
const PriceDisplay = ({ priceEUR, priceSEK }: { priceEUR: number; priceSEK: number; }) => (
  <div className="mt-2">
    <div className="flex items-baseline">
      <span className="text-3xl font-light text-white">€{priceEUR}</span>
      <span className="ml-2 text-sm text-gray-400">EUR</span>
    </div>
    <div className="flex items-baseline mt-1">
      <span className="text-lg font-light text-gray-400">{priceSEK}</span>
      <span className="ml-2 text-xs text-gray-500">SEK</span>
    </div>
  </div>
);

const Features = ({
  features,
  extraFeatures,
  isOpen,
  onToggle,
}: {
  features: string[];
  extraFeatures: string[];
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <>
    <ul className="space-y-3 text-sm border-t border-gray-700/30 pt-6" role="list">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start space-x-3">
          <span className="text-yellow-500 text-lg leading-none">•</span>
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    <div className="pt-2">
      <button
        onClick={onToggle}
        className="w-full text-left text-sm text-yellow-500 hover:underline focus:outline-none flex items-center gap-2"
      >
        {isOpen ? 'Hide additional features' : 'View additional features'}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 space-y-3 text-sm">
          {extraFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-yellow-500 text-lg leading-none">•</span>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);

export default ProjectSelection;
