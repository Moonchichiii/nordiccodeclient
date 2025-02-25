// src/features/planner/components/steps/BusinessGoalsStep.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { RadioGroup } from '@headlessui/react';
import { Target, LayoutGrid, FileText, Check } from 'lucide-react';
import { BusinessGoals } from '@/features/planner/types/types';

interface BusinessGoalsStepProps {
  data: BusinessGoals;
  updateData: (updated: BusinessGoals) => void;
}

const objectives = [
  { id: 'increaseRevenue', label: 'Increase Revenue' },
  { id: 'generateLeads', label: 'Generate Leads' },
  { id: 'buildBrand', label: 'Build Brand Awareness' },
  { id: 'boostEngagement', label: 'Boost User Engagement' },
  { id: 'retainCustomers', label: 'Retain Customers' },
];

const primaryPurposeOptions = [
  'Promote a Physical Business',
  'Sell Products',
  'Get Appointments',
  'Sell Digital Products',
  'Offer Services',
  'Showcase Work/Portfolio',
  'Publish Blog/Media',
  'Collect Donations',
  'Build Community',
];

const homepageSectionsOptions = [
  'Hero/Intro',
  'About',
  'Services/Products',
  'Testimonials',
  'Contact',
  'Blog',
];

const BusinessGoalsStep: React.FC<BusinessGoalsStepProps> = ({ data, updateData }) => {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionsRef.current) return;
    const sections = sectionsRef.current.children;
    gsap.fromTo(
      sections,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );
  }, []);

  const animateSelection = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      { scale: 0.95 },
      {
        scale: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      }
    );
  };

  const updatePrimaryObjective = (val: string) => {
    updateData({ ...data, primaryObjective: val });
  };

  const toggleArrayItem = (
    field: 'primaryPurpose' | 'homepageSections',
    value: string
  ) => {
    const current = data[field] || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateData({ ...data, [field]: updated });
  };

  return (
    <div ref={sectionsRef} className="space-y-8">
      {/* Primary Objective */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground">
              Primary Objective
            </h3>
            <p className="text-sm text-muted-foreground">
              What's the main goal for your website?
            </p>
          </div>
        </div>
        <RadioGroup
          value={data.primaryObjective}
          onChange={updatePrimaryObjective}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {objectives.map((obj) => (
            <RadioGroup.Option
              key={obj.id}
              value={obj.id}
              className={({ checked }) => `
                group relative flex items-center p-4 cursor-pointer rounded-xl border transition-all duration-300 hover:shadow-md
                ${
                  checked
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }
              `}
              onClick={(e) => {
                const target = e.currentTarget as HTMLElement;
                animateSelection(target);
              }}
            >
              {({ checked }) => (
                <>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {obj.label}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ml-4 transition-colors duration-300 ${
                      checked
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3" />}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </section>

      {/* Primary Purpose */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground">
              Primary Purpose
            </h3>
            <p className="text-sm text-muted-foreground">
              Select all that best describe your core business purpose
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {primaryPurposeOptions.map((purpose) => (
            <label
              key={purpose}
              className={`
                group relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md
                ${
                  data.primaryPurpose.includes(purpose)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }
              `}
              onClick={(e) => {
                const target = e.currentTarget as HTMLElement;
                animateSelection(target);
              }}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors duration-300 ${
                  data.primaryPurpose.includes(purpose)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={data.primaryPurpose.includes(purpose)}
                  onChange={() => toggleArrayItem('primaryPurpose', purpose)}
                />
                {data.primaryPurpose.includes(purpose) && (
                  <Check className="w-3 h-3" />
                )}
              </div>
              <span className="text-sm text-foreground">{purpose}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Homepage Sections */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground">
              Homepage Sections
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose the sections for your homepage
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homepageSectionsOptions.map((section) => (
            <label
              key={section}
              className={`
                group relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md
                ${
                  data.homepageSections.includes(section)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }
              `}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors duration-300 ${
                  data.homepageSections.includes(section)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={data.homepageSections.includes(section)}
                  onChange={() => toggleArrayItem('homepageSections', section)}
                />
                {data.homepageSections.includes(section) && (
                  <Check className="w-3 h-3" />
                )}
              </div>
              <span className="text-sm text-foreground">{section}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BusinessGoalsStep;
