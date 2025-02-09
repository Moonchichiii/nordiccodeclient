import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Sparkles, 
  ChevronDown, 
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

import { usePackages } from '@/features/projects/hooks/usePackages';
import AddonsSelection from './AddonsSelection';
import { PackageData } from '@/features/projects/types/types';

const ProjectSelection = () => {
  const navigate = useNavigate();
  const { packages, createProject, isPending } = usePackages();
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
      const projectResponse = await createProject.mutateAsync(pkg.type);
      if (!projectResponse.id) {
        throw new Error("Project ID not returned from API");
      }
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
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-light mb-10">
        Select Your Professional Development Package
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.type}
            className="relative p-6 rounded-xl bg-background border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </span>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-light">{pkg.name}</h3>
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
                className="group w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

const PriceDisplay = ({ priceEUR, priceSEK }: { priceEUR: number; priceSEK: number }) => (
  <div className="mt-2">
    <div className="flex items-baseline">
      <span className="text-3xl font-light">€{priceEUR}</span>
      <span className="ml-2 text-sm text-muted-foreground">EUR</span>
    </div>
    <div className="flex items-baseline mt-1">
      <span className="text-lg font-light text-muted-foreground">{priceSEK}</span>
      <span className="ml-2 text-xs text-muted-foreground">SEK</span>
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
    <ul className="space-y-3 text-sm border-t border-border/30 pt-6" role="list">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start space-x-3">
          <span className="text-primary text-lg leading-none">•</span>
          <span className="text-muted-foreground">{feature}</span>
        </li>
      ))}
    </ul>
    <div className="pt-2">
      <button
        onClick={onToggle}
        className="w-full text-left text-sm text-primary hover:text-primary/80 focus:outline-none flex items-center gap-2"
      >
        {isOpen ? 'Hide additional features' : 'View additional features'}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 space-y-3 text-sm">
          {extraFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-primary text-lg leading-none">•</span>
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);

export default ProjectSelection;