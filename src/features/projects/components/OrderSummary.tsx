import { ArrowUpRight } from 'lucide-react';
import { PackageData, Addon } from '@/features/projects/types/types';

interface OrderSummaryProps {
  selectedPackage: PackageData;
  selectedAddons: Set<string>;
  addons: Addon[];
  total: number;
  isPending: boolean;
  onContinue: () => Promise<void>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedPackage, selectedAddons, addons, total, isPending, onContinue }) => (
  <div className="lg:sticky lg:top-6 h-fit">
    <div className="p-6 rounded-xl bg-gray-800/50 space-y-6">
      <h3 className="text-lg font-medium text-white">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>Base Package</span>
          <span>€{selectedPackage.priceEUR}</span>
        </div>
        {Array.from(selectedAddons).map((addonId) => {
          const addon = addons.find((a) => a.id === addonId);
          return addon ? (
            <div key={addonId} className="flex justify-between text-gray-300">
              <span>{addon.title}</span>
              <span>€{addon.priceEUR}</span>
            </div>
          ) : null;
        })}
        <div className="pt-3 border-t border-gray-700/30">
          <div className="flex justify-between text-white">
            <span className="font-medium">Total</span>
            <span className="font-medium">€{total}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onContinue}
        disabled={isPending}
        className="w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:opacity-50"
      >
        <span>Continue to Planning Stage</span>
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </div>
  </div>
);

export default OrderSummary;
