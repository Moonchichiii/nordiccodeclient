import React from 'react';
import { DeveloperWorksheet } from '../types/developer.types';
import TechnicalSpecs from './TechnicalSpecs';
import ArchitectureView from './ArchitectureView';

interface WorksheetDisplayProps {
  worksheet: DeveloperWorksheet;
  isEditable?: boolean;
  onUpdate?: (section: string, value: any) => void;
}

export const WorksheetDisplay: React.FC<WorksheetDisplayProps> = ({
  worksheet,
  isEditable = false,
  onUpdate
}) => {
  return (
    <div className="space-y-8">
      <ArchitectureView 
        architecture={worksheet.architecture}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
      <TechnicalSpecs
        specs={worksheet.technical_specifications}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
      <div className="rounded-xl bg-gray-900 p-6">
        <h3 className="text-xl font-medium text-white mb-4">
          Implementation Details
        </h3>
        <div className="prose prose-invert max-w-none">
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(worksheet.requirements, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};