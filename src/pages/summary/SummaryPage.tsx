import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProjectSummary from '@/features/summary/components/ProjectSummary';
import { PackageData } from '@/features/projects/types/types';

interface SummaryState {
  projectId: number;
  selectedPackage: PackageData;
  selectedAddons: string[];
  totalPrice: number;
  // Optionally include the AI-generated summaries:
  clientSummary?: string;
  developerWorksheet?: string;
}

const SummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SummaryState | null;

  // If state is missing or invalid, redirect back to the Planner page
  if (!state || !state.projectId) {
    navigate('/dashboard/planner');
    return null;
  }

  const { projectId, selectedPackage, selectedAddons, totalPrice, clientSummary, developerWorksheet } = state;

  const handleConfirm = () => {
    // Navigate to the Billing Instructions page with all the collected data
    navigate('/dashboard/billing-inst', {
      state: {
        projectId,
        selectedPackage,
        selectedAddons,
        totalPrice,
      },
    });
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-light mb-4">Project Summary</h1>
      <ProjectSummary
        projectId={projectId}
        onConfirm={handleConfirm}
        selectedPackage={selectedPackage}
        selectedAddons={selectedAddons}
        totalPrice={totalPrice}
        clientSummary={clientSummary}
        developerWorksheet={developerWorksheet}
      />
    </div>
  );
};

export default SummaryPage;
