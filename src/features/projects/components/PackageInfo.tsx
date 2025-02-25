// src/features/projects/components/shared/PackageInfo.tsx
import { PackageData } from '@/features/projects/types/types';

interface PackageInfoProps {
  selectedPackage: PackageData;
}

const PackageInfo: React.FC<PackageInfoProps> = ({ selectedPackage }) => (
  <div className="p-6 rounded-xl bg-gray-800/50 space-y-4">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-xl font-light text-white">{selectedPackage.name}</h3>
        <p className="text-sm text-gray-400 mt-1">Selected Package</p>
      </div>
      <div className="text-right">
        <div className="flex items-baseline">
          <span className="text-2xl font-light text-white">€{selectedPackage.priceEUR}</span>
          <span className="ml-2 text-sm text-gray-400">EUR</span>
        </div>
        <div className="flex items-baseline mt-1">
          <span className="text-sm font-light text-gray-400">{selectedPackage.priceSEK}</span>
          <span className="ml-1 text-xs text-gray-500">SEK</span>
        </div>
      </div>
    </div>
  </div>
);

export default PackageInfo;
