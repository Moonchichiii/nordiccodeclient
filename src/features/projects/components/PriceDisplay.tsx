// src/features/projects/components/shared/PriceDisplay.tsx
interface PriceDisplayProps {
    priceEUR: number;
    priceSEK: number;
  }
  
  const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceEUR, priceSEK }) => (
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
  
  export default PriceDisplay;
  