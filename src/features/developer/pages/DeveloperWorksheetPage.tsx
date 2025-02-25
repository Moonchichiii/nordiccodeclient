import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeveloperData } from '../hooks/useDeveloperData';
import { WorksheetDisplay } from '../components/WorksheetDisplay';
import { DeveloperHeader } from '../components/DeveloperHeader';

const DeveloperWorksheetPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    worksheet,
    isLoading,
    error,
    updateNotes
  } = useDeveloperData(parseInt(projectId!, 10));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="animate-pulse space-y-4">
          {/* Loading skeleton */}
        </div>
      </div>
    );
  }

  if (error || !worksheet) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-white">
        <h2 className="text-xl">Error loading worksheet</h2>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <DeveloperHeader
        projectId={worksheet.projectId}
        onBack={() => navigate(-1)}
      />
      <main className="container mx-auto px-6 py-8">
        <WorksheetDisplay
          worksheet={worksheet}
          isEditable={true}
          onUpdate={async (section, value) => {
            await updateNotes.mutateAsync(value);
          }}
        />
      </main>
    </div>
  );
};

export default DeveloperWorksheetPage;