// src/features/planner/components/design/ColorPalette.tsx
import React, { useState } from 'react';

interface ColorPalette {
  name: string;
  colors: string[];
  description: string;
  category: 'modern' | 'nature' | 'corporate' | 'creative' | 'luxury';
}

interface ColorPaletteProps {
  selected: string;
  onChange: (palette: string) => void;
}

const colorPalettes: ColorPalette[] = [
  {
    name: 'Modern Minimal',
    colors: ['#F8FAFC', '#E2E8F0', '#64748B', '#0F172A'],
    description: 'Clean and professional',
    category: 'modern'
  },
  {
    name: 'Nature Fresh',
    colors: ['#ECFCCB', '#84CC16', '#3F6212', '#14532D'],
    description: 'Organic and calming',
    category: 'nature'
  },
  {
    name: 'Ocean Breeze',
    colors: ['#F0F9FF', '#7DD3FC', '#0369A1', '#082F49'],
    description: 'Refreshing and trustworthy',
    category: 'modern'
  },
  {
    name: 'Tech Dark',
    colors: ['#18181B', '#27272A', '#52525B', '#71717A'],
    description: 'Modern tech aesthetic',
    category: 'modern'
  },
  {
    name: 'Nordic Frost',
    colors: ['#E5E9F0', '#ECEFF4', '#D8DEE9', '#4C566A'],
    description: 'Clean Scandinavian design',
    category: 'modern'
  },
  {
    name: 'Sunset Gradient',
    colors: ['#FF6B6B', '#F06595', '#CC5DE8', '#845EF7'],
    description: 'Vibrant and modern',
    category: 'creative'
  },
  {
    name: 'Royal Elegance',
    colors: ['#2C3E50', '#34495E', '#8E44AD', '#9B59B6'],
    description: 'Sophisticated and premium',
    category: 'luxury'
  },
  {
    name: 'Golden Touch',
    colors: ['#D4AF37', '#FFF5E1', '#1A1A1A', '#4A4A4A'],
    description: 'Luxurious and elegant',
    category: 'luxury'
  },
  {
    name: 'Business Pro',
    colors: ['#0A192F', '#172A45', '#303C55', '#8892B0'],
    description: 'Professional and trustworthy',
    category: 'corporate'
  }
];

const categories = [
  { id: 'modern', label: 'Modern' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'creative', label: 'Creative' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'nature', label: 'Nature' },
] as const;

const ColorPalette: React.FC<ColorPaletteProps> = ({ selected, onChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<ColorPalette['category']>('modern');

  const filteredPalettes = colorPalettes.filter(
    palette => palette.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="flex space-x-2 rounded-xl bg-background p-1 border border-border">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as ColorPalette['category'])}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5
              transition-all duration-200
              ${selectedCategory === category.id
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Color Palettes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPalettes.map((palette) => (
          <button
            key={palette.name}
            onClick={() => onChange(palette.name)}
            className={`group relative p-4 rounded-xl border transition-all duration-300 
              ${selected === palette.name
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent/5'
              }`}
          >
            {/* Color Swatches */}
            <div className="flex gap-2 mb-3">
              {palette.colors.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Palette Info */}
            <div className="text-left">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {palette.name}
              </h4>
              <p className="text-sm text-muted-foreground">{palette.description}</p>
            </div>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;