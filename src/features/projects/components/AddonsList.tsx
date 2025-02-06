import { CheckCircle2 } from 'lucide-react';
import { Addon } from '@/features/projects/types/types';

interface AddonsListProps {
  addons: Addon[];
  selectedAddons: Set<string>;
  isEnterpriseIncluded: (id: string) => boolean;
  onToggle: (id: string) => void;
}

const AddonsList: React.FC<AddonsListProps> = ({ addons, selectedAddons, isEnterpriseIncluded, onToggle }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-white">Available Add-ons</h3>
    <div className="space-y-4">
      {addons.map((addon) => {
        const included = isEnterpriseIncluded(addon.id);
        return (
          <div
            key={addon.id}
            onClick={() => {
              if (!included) {
                onToggle(addon.id);
              }
            }}
            className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
              included
                ? 'border-green-500 bg-green-500/10 cursor-not-allowed'
                : selectedAddons.has(addon.id)
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-gray-700/50 hover:border-yellow-500/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <CheckCircle2
                className={`w-5 h-5 mt-0.5 ${
                  included
                    ? 'text-green-500'
                    : selectedAddons.has(addon.id)
                    ? 'text-yellow-500'
                    : 'text-gray-500'
                }`}
              />
              <div className="flex-grow">
                <h4 className="text-white font-medium">
                  {addon.title}{' '}
                  {included && (
                    <span className="text-xs text-green-400 ml-2">(Included in Enterprise)</span>
                  )}
                </h4>
                <p className="text-sm text-gray-400 mt-1">{addon.description}</p>
              </div>
              {!included && (
                <div className="text-right">
                  <div className="flex items-baseline">
                    <span className="text-lg font-light text-white">€{addon.priceEUR}</span>
                    <span className="ml-2 text-sm text-gray-400">EUR</span>
                  </div>
                  <div className="text-sm text-gray-400">{addon.priceSEK} SEK</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default AddonsList;
