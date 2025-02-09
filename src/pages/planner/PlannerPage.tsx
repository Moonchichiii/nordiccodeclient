import React from 'react';
import PlannerForm from '@/features/planner/components/PlannerForm';
import { useSubmitPlanner } from '@/features/planner/hooks/useSubmitPlanner';
import { toast } from 'react-toastify';
import { ProjectRequirements } from '@/features/planner/types/types';
import { useNavigate, useLocation } from 'react-router-dom';

const PlannerPage: React.FC = () => {
  const { mutateAsync } = useSubmitPlanner();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const handleSubmit = async (data: ProjectRequirements) => {
    try {
      const submissionResult = await mutateAsync({ submission_data: data });
      toast.success('Planner submission successful!');
      navigate('/dashboard/summary', {
        state: {
          projectId: submissionResult.project.id,
          selectedPackage: state.selectedPackage,
          selectedAddons: state.selectedAddons,
          totalPrice: state.totalPrice,
          clientSummary: submissionResult.client_summary,
          developerWorksheet: submissionResult.developer_worksheet
        },
      });
    } catch (error: any) {
      toast.error(`Submission failed: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 pb-32 lg:pb-6 pt-6">
      <div className="max-w-4xl mx-auto">
        
        </div>

        <div className="rounded-xl bg-background border border-border/50">
          <div className="p-4 sm:p-6">
            <PlannerForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    
  );
};

export default PlannerPage;