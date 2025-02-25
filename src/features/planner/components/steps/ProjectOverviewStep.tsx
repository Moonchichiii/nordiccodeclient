import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { RadioGroup } from '@headlessui/react';
import { Building2, Target, Clock, Check, Sparkles } from 'lucide-react';
import { Requirements } from '@/features/planner/types/types';

interface ProjectOverviewStepProps {
  data: Requirements['projectOverview'];
  updateData: (data: Partial<Requirements['projectOverview']>) => void;
}

const industries = [
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'finance', label: 'Finance' },
  { id: 'technology', label: 'Technology' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'realestate', label: 'Real Estate' },
  { id: 'other', label: 'Other' },
];

const timelines = [
  { id: 'urgent', label: 'ASAP (1-2 months)' },
  { id: 'standard', label: 'Standard (3-4 months)' },
  { id: 'relaxed', label: 'Flexible (4-6 months)' },
  { id: 'strategic', label: 'Strategic (6+ months)' },
];

const ProjectOverviewStep: React.FC<ProjectOverviewStepProps> = ({ data, updateData }) => {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionsRef.current) return;
    const sections = sectionsRef.current.children;
    gsap.fromTo(
      sections,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
    );
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', () => {
        gsap.to(inputRef.current, { boxShadow: '0 0 0 4px rgba(var(--primary), 0.1)', duration: 0.3 });
      });
      inputRef.current.addEventListener('blur', () => {
        gsap.to(inputRef.current, { boxShadow: 'none', duration: 0.3 });
      });
    }
  }, []);

  useEffect(() => {
    if (data.projectName && sparklesRef.current) {
      gsap.fromTo(sparklesRef.current, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }, [data.projectName]);

  const animateSelection = (element: HTMLElement) => {
    gsap.fromTo(element, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    const checkIcon = element.querySelector('.check-icon');
    if (checkIcon) {
      gsap.fromTo(checkIcon, { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(2)' });
    }
  };

  const SectionHeader = ({ icon: Icon, title, description }: { icon: any; title: string; description?: string }) => (
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
      {/* Project Name */}
      <section className="space-y-4 relative">
        <SectionHeader icon={Building2} title="Project Details" description="Tell us about your project" />
        <div className="space-y-4">
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground">Project Name</label>
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={data.projectName}
                onChange={(e) => updateData({ projectName: e.target.value })}
                placeholder="Enter your project name"
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              {data.projectName && (
                <div ref={sparklesRef} className="absolute top-1 right-1">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Industry Selection */}
      <section className="space-y-4">
        <SectionHeader icon={Target} title="Industry" description="Select your business sector" />
        <RadioGroup
          value={data.industry}
          onChange={(val) => updateData({ industry: val })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {industries.map((industry) => (
            <RadioGroup.Option
              key={industry.id}
              value={industry.id}
              className={({ checked }) => `
                group relative flex items-center p-4 cursor-pointer rounded-xl border transition-all duration-300 hover:shadow-md
                ${checked ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/5'}
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
                      {industry.label}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ml-4 transition-colors duration-300 ${checked ? 'bg-primary border-primary text-primary-foreground' : 'border-border'}`}>
                    {checked && <Check className="w-3 h-3 check-icon" />}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </section>
      {/* Timeline Selection */}
      <section className="space-y-4">
        <SectionHeader icon={Clock} title="Timeline" description="Choose your preferred development timeline" />
        <RadioGroup
          value={data.timeline}
          onChange={(val) => updateData({ timeline: val })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {timelines.map((timeline) => (
            <RadioGroup.Option
              key={timeline.id}
              value={timeline.id}
              className={({ checked }) => `
                group relative flex items-center p-4 cursor-pointer rounded-xl border transition-all duration-300 hover:shadow-md
                ${checked ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/5'}
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
                      {timeline.label}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ml-4 transition-colors duration-300 ${checked ? 'bg-primary border-primary text-primary-foreground' : 'border-border'}`}>
                    {checked && <Check className="w-3 h-3 check-icon" />}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </section>
    </div>
  );
};

export default ProjectOverviewStep;
