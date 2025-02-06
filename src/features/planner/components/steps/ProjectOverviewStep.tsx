import React from 'react';
import TextInput from '@/features/planner/components/ui/TextInput';
import SelectInput from '@/features/planner/components/ui/SelectInput';
import CheckboxGroup from '@/features/planner/components/ui/CheckboxGroup';
import { ProjectRequirements } from '@/features/planner/types/types';

interface ProjectOverviewStepProps {
  data: ProjectRequirements['projectOverview'];
  updateData: (data: ProjectRequirements['projectOverview']) => void;
}

const industryOptions = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

const timelineOptions = [
  { value: 'urgent', label: 'ASAP (1-2 months)' },
  { value: 'standard', label: 'Standard (3-4 months)' },
  { value: 'relaxed', label: 'Flexible (4-6 months)' },
  { value: 'strategic', label: 'Strategic (6+ months)' },
];

const targetAudienceOptions = [
  'Young Professionals (25-34)',
  'Senior Executives',
  'Students',
  'Parents',
  'Tech-savvy Users',
  'General Public',
  'Enterprise Clients'
];

const ProjectOverviewStep: React.FC<ProjectOverviewStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-light text-white mb-6">Project Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Project Name"
          placeholder="e.g., Modern E-commerce Platform"
          value={data.projectName}
          onChange={value => updateData({ ...data, projectName: value })}
        />
        <SelectInput
          label="Industry"
          value={data.industry}
          options={industryOptions}
          onChange={value => updateData({ ...data, industry: value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Vision"
          placeholder="Describe your project vision..."
          value={data.vision}
          onChange={value => updateData({ ...data, vision: value })}
        />
        <div className="space-y-4">
          <SelectInput
            label="Timeline"
            value={data.timeline}
            options={timelineOptions}
            onChange={value => updateData({ ...data, timeline: value })}
          />         
        </div>
      </div>
      <CheckboxGroup
        label="Target Audience"
        options={targetAudienceOptions}
        selected={data.targetAudience}
        onChange={selected => updateData({ ...data, targetAudience: selected })}
      />
    </div>
  );
};

export default ProjectOverviewStep;
