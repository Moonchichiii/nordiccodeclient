import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { PackageData } from '@/features/projects/types/types';
import { parsePrice } from '@/features/projects/utils/price';
import { useAddons } from '@/features/projects/hooks/useAddons';

// Import modular UI components (ensure these exist in your features folder)
import Header from '@/features/projects/components/Header';
import PackageInfo from '@/features/projects/components/PackageInfo';
import AddonsList from '@/features/projects/components/AddonsList';
import OrderSummary from '@/features/projects/components/OrderSummary';

const AddonsSelection: React.FC<{ selectedPackage: PackageData; onBack: () => void }> = ({ selectedPackage, onBack }) => {
  const navigate = useNavigate();
  const { addons, enterpriseIncludedAddons, saveAddons, isPending } = useAddons();
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  // Use selectedPackage.type (not the ID) everywhere.
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

  // Calculate total price: base package price plus add-on prices (if not included)
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

  // Get the real project ID from the selected package.
  const projectId = selectedPackage.projectId;
  if (!projectId) {
    toast.error('Project ID not found. Please restart the project creation process.');
  }

  const handleContinue = async () => {
    if (!projectId) {
      toast.error('No project ID found');
      return;
    }
    try {
        await saveAddons.mutateAsync({
            projectId,
            addons: Array.from(selectedAddons)
          });
          
      navigate('/dashboard/plannerPage', {
        state: {
          selectedPackage: { ...selectedPackage, projectId },
          selectedAddons: Array.from(selectedAddons),
          totalPrice: calculateTotal()
        }
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
    <main className="w-full max-w-6xl mx-auto p-6">
      <Header onBack={onBack} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PackageInfo selectedPackage={selectedPackage} />
          <AddonsList
            addons={visibleAddons}
            selectedAddons={selectedAddons}
            isEnterpriseIncluded={isEnterpriseIncluded}
            onToggle={toggleAddon}
          />
        </div>
        <OrderSummary
          selectedPackage={selectedPackage}
          selectedAddons={selectedAddons}
          addons={addons}
          total={calculateTotal()}
          isPending={isPending}
          onContinue={handleContinue}
        />
      </div>
    </main>
  );
};

export default AddonsSelection;
