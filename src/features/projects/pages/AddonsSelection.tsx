// src/features/projects/pages/AddonsSelection.tsx
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, PackageCheck, Check, Loader2, ChevronRight } from 'lucide-react';

import { PackageData } from '@/features/projects/types/types';
import { useProjectAddons as useAddons } from '@/features/projects/hooks/useProjectData';

<StepNavigation steps={projectSteps} currentStep={2} type="project" />


const AddonsSelection = ({
  selectedPackage,
  onBack,
}: {
  selectedPackage: PackageData & { projectId?: number };
  onBack: () => void;
}) => {
  const navigate = useNavigate();
  const { addons, enterpriseIncludedAddons, saveAddons, isPending } = useAddons();
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  const isEnterpriseIncluded = useCallback(
    (addonId: string) =>
      selectedPackage.type === 'enterprise' &&
      enterpriseIncludedAddons.includes(addonId),
    [selectedPackage, enterpriseIncludedAddons]
  );

  const toggleAddon = useCallback((addonId: string) => {
    setSelectedAddons((prev) => {
      const newSet = new Set(prev);
      newSet.has(addonId) ? newSet.delete(addonId) : newSet.add(addonId);
      return newSet;
    });
  }, []);

  const calculateTotal = useCallback(() => {
    let total = selectedPackage.priceEUR;
    selectedAddons.forEach((addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      if (addon && !isEnterpriseIncluded(addon.id)) {
        total += addon.priceEUR;
      }
    });
    return total;
  }, [selectedAddons, selectedPackage, addons, isEnterpriseIncluded]);

  const projectId = selectedPackage.projectId;

  const handleContinue = async () => {
    if (!projectId) {
      toast.error('No project ID found');
      return;
    }
    try {
      await saveAddons.mutateAsync({
        projectId,
        // Convert addon IDs to numbers if needed or leave as strings if backend expects strings.
        addons: Array.from(selectedAddons).map((id) =>
          isNaN(Number(id)) ? id : Number(id)
        ),
      });
      // Navigate to the planner page, passing along project info.
      navigate('/dashboard/plannerPage', {
        state: {
          projectId, // pass the projectId explicitly here
          selectedPackage: { ...selectedPackage, projectId },
          selectedAddons: Array.from(selectedAddons),
          totalPrice: calculateTotal()
        },
      });
      
    } catch (err: any) {
      console.error('Save addons error:', err.response?.data || err);
      toast.error(err.response?.data?.detail || 'Failed to save addons');
    }
  };

  const visibleAddons = useMemo(
    () => addons.filter((addon) => addon.compatible.includes(selectedPackage.type)),
    [addons, selectedPackage]
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 pb-32 lg:pb-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Packages
          </button>
          <h1 className="text-2xl sm:text-3xl font-light">Customize Your Package</h1>
          <p className="text-sm text-muted-foreground">Select additional features for your project</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Package Summary */}
          <div className="rounded-xl bg-background border border-border/50 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <PackageCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-light">{selectedPackage.name}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Base Package</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">{selectedPackage.description}</p>
          </div>

          {/* Add-ons List */}
          <div className="rounded-xl bg-background border border-border/50">
            <div className="p-4 sm:p-6 border-b border-border/50">
              <h2 className="text-base sm:text-lg font-light">Available Add-ons</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Enhance your package with additional features</p>
            </div>
            <div className="divide-y divide-border/50">
              {visibleAddons.map((addon) => {
                const isIncluded = isEnterpriseIncluded(addon.id);
                const isSelected = selectedAddons.has(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => !isIncluded && toggleAddon(addon.id)}
                    className={`group flex items-start justify-between gap-3 sm:gap-4 p-4 sm:p-6 transition-all duration-200 cursor-pointer select-none ${
                      isIncluded
                        ? 'bg-background/50 cursor-default'
                        : isSelected
                        ? 'bg-primary/5 hover:bg-primary/10'
                        : 'hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
                            isIncluded
                              ? 'bg-primary/10 border-primary/20'
                              : isSelected
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-border group-hover:border-primary'
                          }`}
                        >
                          {(isSelected || isIncluded) && (
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          )}
                        </div>
                        <h3 className="font-light text-sm sm:text-base truncate">{addon.name}</h3>
                        {isIncluded && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                            Included
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 ml-6 sm:ml-7">
                        {addon.description}
                      </p>
                    </div>
                    {!isIncluded && (
                      <span
                        className={`text-xs sm:text-sm font-medium transition-colors duration-200 flex-shrink-0 pt-1 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      >
                        €{addon.priceEUR}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary - Fixed on mobile */}
        <div className="fixed bottom-16 lg:bottom-auto lg:static left-0 right-0 lg:relative bg-background/80 backdrop-blur-md lg:backdrop-blur-none border-t lg:border lg:rounded-xl shadow-lg lg:shadow-none">
          <div className="hidden lg:block p-6 border-b border-border/50">
            <h2 className="text-lg font-light">Order Summary</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3 hidden lg:block">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Base Package</span>
                <span className="text-sm font-medium">€{selectedPackage.priceEUR}</span>
              </div>
              {Array.from(selectedAddons).map((addonId) => {
                const addon = addons.find((a) => a.id === addonId);
                if (!addon || isEnterpriseIncluded(addon.id)) return null;
                return (
                  <div key={addonId} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{addon.name}</span>
                    <span className="text-sm font-medium">€{addon.priceEUR}</span>
                  </div>
                );
              })}
              <div className="h-px bg-border/50 my-4" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm sm:text-base">Total Price</span>
              <span className="text-lg sm:text-xl font-bold">€{calculateTotal()}</span>
            </div>
            <button
              className="w-full py-2.5 sm:py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleContinue}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Continue to Planning
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddonsSelection;
