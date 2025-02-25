// src/features/planner/components/steps/DesignPreferencesStep.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Layout,
  Globe,
  Monitor,
  Check,
  Palette,
  Paintbrush2,
  Type,
  Droplet,
  Sparkles,
  Zap,
  Users,
  Smartphone,
} from 'lucide-react';
import { DesignPreferences } from '@/features/planner/types/types';
import ColorPalette from '@/features/planner/components/design/ColorPalette';
import StyleSelector from '@/features/planner/components/design/StyleSelector';

interface DesignPreferencesStepProps {
  designPreferences: DesignPreferences;
  onChange: (updated: DesignPreferences) => void;
}

const brandPersonalityOptions = [
  {
    value: 'Professional',
    description: 'Clean, trustworthy, and corporate',
    icon: '🏢',
  },
  {
    value: 'Playful',
    description: 'Fun, energetic, and engaging',
    icon: '🎨',
  },
  {
    value: 'Sophisticated',
    description: 'Elegant, refined, and luxurious',
    icon: '✨',
  },
  {
    value: 'Bold',
    description: 'Strong, confident, and impactful',
    icon: '💪',
  },
  {
    value: 'Friendly',
    description: 'Approachable, warm, and welcoming',
    icon: '🤝',
  },
  {
    value: 'Innovative',
    description: 'Modern, cutting-edge, and forward-thinking',
    icon: '💡',
  },
];

const deviceOptions = ['Desktop', 'Tablet', 'Mobile', 'Large Displays'];
const fontPairingOptions = [
  'Roboto (Professional)',
  'Shrikhand (Playful)',
  'Libre Baskerville (Sophisticated)',
  'Manrope (Friendly)',
  'Anton (Bold)',
  'Space Grotesk (Innovative)',
];

const userExperienceOptions = {
  accessibility: [
    {
      value: 'standard',
      title: 'Standard Accessibility',
      description:
        'Basic accessibility features ensuring your website works for most users',
      icon: Users,
    },
    {
      value: 'enhanced',
      title: 'Enhanced Accessibility',
      description:
        'Additional features for better accessibility, including screen readers and keyboard navigation',
      icon: Users,
    },
    {
      value: 'full',
      title: 'Full WCAG 2.1 Compliance',
      description: 'Complete accessibility compliance meeting all modern standards',
      icon: Users,
    },
  ],
  performance: [
    {
      value: 'standard',
      title: 'Standard Performance',
      description: 'Optimized for regular browsing with good loading speeds',
      icon: Zap,
    },
    {
      value: 'high',
      title: 'High Performance',
      description: 'Enhanced optimization for faster loading and smoother interactions',
      icon: Zap,
    },
    {
      value: 'premium',
      title: 'Premium Performance',
      description: 'Maximum optimization for instant loading and seamless experience',
      icon: Zap,
    },
  ],
  responsive: [
    {
      value: 'mobile-first',
      title: 'Mobile-First Design',
      description: 'Optimized for mobile devices first, then adapted for larger screens',
      icon: Smartphone,
    },
    {
      value: 'desktop-first',
      title: 'Desktop-First Design',
      description: 'Optimized for desktop viewing, then adapted for smaller screens',
      icon: Monitor,
    },
    {
      value: 'unified',
      title: 'Unified Experience',
      description: 'Equally optimized for all devices with consistent features',
      icon: Monitor,
    },
  ],
};

const DesignPreferencesStep: React.FC<DesignPreferencesStepProps> = ({
  designPreferences,
  onChange,
}) => {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!sectionsRef.current) return;
    const sections = sectionsRef.current.children;

    gsap.fromTo(
      sections,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
    );

    if (textareaRef.current) {
      textareaRef.current.addEventListener('focus', () => {
        gsap.to(textareaRef.current, {
          boxShadow: '0 0 0 4px rgba(var(--primary), 0.1)',
          duration: 0.3,
        });
      });
      textareaRef.current.addEventListener('blur', () => {
        gsap.to(textareaRef.current, { boxShadow: 'none', duration: 0.3 });
      });
    }
  }, []);

  const animateSelection = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      { scale: 0.95 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
    );
    const glow = document.createElement('div');
    glow.className = 'absolute inset-0 bg-primary/10 rounded-xl';
    element.appendChild(glow);
    gsap.fromTo(
      glow,
      { opacity: 0.5, scale: 1.1 },
      {
        opacity: 0,
        scale: 1.2,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => glow.remove(),
      }
    );
  };

  const handleUpdate = (updatedPart: Partial<DesignPreferences>) => {
    onChange({ ...designPreferences, ...updatedPart });
  };

  const OptionCard = ({
    icon: Icon,
    title,
    description,
    selected,
    onClick,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`group relative p-4 rounded-xl border transition-all duration-300 text-left
        ${
          selected
            ? 'border-primary bg-primary/5 shadow-lg'
            : 'border-border hover:border-primary/50 hover:bg-accent/5'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${selected ? 'bg-primary/20' : 'bg-accent/50'}`}>
          <Icon className={`w-5 h-5 ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {selected && (
        <div className="absolute top-2 right-2">
          <Check className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </button>
  );

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
  }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );

  return (
    <div ref={sectionsRef} className="space-y-8">
      {/* Brand Personality */}
      <section className="space-y-4">
        <SectionHeader
          icon={Sparkles}
          title="Brand Personality"
          description="Define your brand's character and tone"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandPersonalityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleUpdate({ brandPersonality: option.value })}
              className={`group relative p-4 rounded-xl border transition-all duration-300 text-left
                ${
                  designPreferences.brandPersonality === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {option.value}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
              {designPreferences.brandPersonality === option.value && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          ))}
        </div>
      </section>

      {/* Brand Guidelines */}
      <section className="space-y-4">
        <SectionHeader
          icon={Layout}
          title="Brand Guidelines"
          description="Tell us about your existing brand identity"
        />
        <div className="space-y-4">
          <label
            className="group relative flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/5 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={(e) => {
              const target = e.currentTarget as HTMLElement;
              animateSelection(target);
            }}
          >
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={designPreferences.brandGuidelines.exists}
                onChange={(e) =>
                  handleUpdate({
                    brandGuidelines: {
                      ...designPreferences.brandGuidelines,
                      exists: e.target.checked,
                    },
                  })
                }
                className="peer sr-only"
              />
              <div
                className={`absolute inset-0 rounded-md border transition-colors duration-300 ${
                  designPreferences.brandGuidelines.exists
                    ? 'bg-primary border-primary'
                    : 'border-border group-hover:border-primary/50'
                }`}
              />
              {designPreferences.brandGuidelines.exists && (
                <Check className="absolute h-3 w-3 text-primary-foreground" />
              )}
            </div>
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              I have existing brand guidelines
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </label>
          {designPreferences.brandGuidelines.exists && (
            <div className="relative group">
              <textarea
                ref={textareaRef}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-colors duration-300"
                placeholder="Describe your brand guidelines or provide a link..."
                value={designPreferences.brandGuidelines.description}
                onChange={(e) =>
                  handleUpdate({
                    brandGuidelines: {
                      ...designPreferences.brandGuidelines,
                      description: e.target.value,
                    },
                  })
                }
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          )}
        </div>
      </section>

      {/* NEW User Experience Section (replacing old one) */}
      <section className="space-y-8">
        <SectionHeader
          icon={Monitor}
          title="User Experience"
          description="Choose how your website will perform and adapt"
        />

        {/* Accessibility Options */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Users className="w-5 h-5 text-primary" />
            Accessibility Level
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userExperienceOptions.accessibility.map((option) => (
              <OptionCard
                key={option.value}
                icon={option.icon}
                title={option.title}
                description={option.description}
                selected={designPreferences.userExperience.accessibility === option.value}
                onClick={() =>
                  handleUpdate({
                    userExperience: {
                      ...designPreferences.userExperience,
                      accessibility: option.value,
                    },
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* Performance Options */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Zap className="w-5 h-5 text-primary" />
            Performance Level
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userExperienceOptions.performance.map((option) => (
              <OptionCard
                key={option.value}
                icon={option.icon}
                title={option.title}
                description={option.description}
                selected={designPreferences.userExperience.performance === option.value}
                onClick={() =>
                  handleUpdate({
                    userExperience: {
                      ...designPreferences.userExperience,
                      performance: option.value,
                    },
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* Responsive Design Options */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Smartphone className="w-5 h-5 text-primary" />
            Responsive Design
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userExperienceOptions.responsive.map((option) => (
              <OptionCard
                key={option.value}
                icon={option.icon}
                title={option.title}
                description={option.description}
                selected={designPreferences.userExperience.responsive === option.value}
                onClick={() =>
                  handleUpdate({
                    userExperience: {
                      ...designPreferences.userExperience,
                      responsive: option.value,
                    },
                  })
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Font Pairing */}
      <section className="space-y-4">
        <SectionHeader
          icon={Type}
          title="Font Pairing"
          description="Select a font pairing style for your design"
        />
        <select
          value={designPreferences.fontPairing}
          onChange={(e) => handleUpdate({ fontPairing: e.target.value })}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">Select Font Style</option>
          {fontPairingOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>

      {/* Color Palette */}
      <section className="space-y-4">
        <SectionHeader
          icon={Droplet}
          title="Color Palette"
          description="Select a color palette for your design"
        />
        <ColorPalette
          selected={designPreferences.colorPalette}
          onChange={(palette) => handleUpdate({ colorPalette: palette })}
        />
      </section>

      {/* Style Selector */}
      <section className="space-y-4">
        <SectionHeader
          icon={Paintbrush2}
          title="Style Selector"
          description="Choose a style option for your design"
        />
        <StyleSelector
          selected={designPreferences.stylePreference}
          onChange={(style) => handleUpdate({ stylePreference: style })}
        />
      </section>
    </div>
  );
};

export default DesignPreferencesStep;
