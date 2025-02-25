import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Requirements } from '@/features/planner/types/types';
import { usePlannerSubmission } from '@/features/planner/hooks/useSubmitPlanner';
import PlannerForm from '@/features/planner/components/forms/PlannerForm';
import BuildingLoader from '@/components/ui/BuildingLoader';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface LocationState {
  projectId: number;
  selectedPackage: {
    type: string;
    name: string;
    price_eur: number;
    features: string[];
  };
  selectedAddons: Array<{
    id: string;
    title: string;
    price_eur: number;
  }>;
  totalPrice: number;
}

const PlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<LocationState | null>(null);
  const [loadingStage, setLoadingStage] = useState<'initial' | 'processing'>('initial');
  // Use a ref for the loader instance:
  const loaderRef = useRef<BuildingLoader | null>(null);

  const { mutateAsync: submitPlanner } = usePlannerSubmission();

  useEffect(() => {
    // Validate location state
    const validateState = () => {
      const locationState = location.state as LocationState | null;
      if (!locationState || !locationState.projectId || !locationState.selectedPackage) {
        toast.error('Missing project information. Redirecting to project selection.');
        navigate('/dashboard/project-selection');
        return null;
      }
      return locationState;
    };

    const validatedState = validateState();
    if (validatedState) {
      setState(validatedState);
    }
  }, [location.state, navigate]);

  // Prevent rendering if state is not valid
  if (!state) {
    return null;
  }

  const handleSubmit = async (requirements: Requirements) => {
    try {
      setLoadingStage('processing');
      toast.info('Processing your requirements...');

      // Create and store loader in the ref:
      const loader = new BuildingLoader({
        textColor: '#00ff88',
        fontSize: '4rem',
        shimmerColor: 'rgba(0,255,136,0.4)',
        animationDuration: 2,
      });
      loader.initialize();
      loaderRef.current = loader;

      const response = await submitPlanner({
        projectId: state.projectId,
        requirements,
        projectContext: {
          selectedPackage: state.selectedPackage,
          selectedAddons: state.selectedAddons || [],
          totalPrice: state.totalPrice,
        },
      });

      // Immediately update loading stage then destroy the loader:
      setLoadingStage('initial');
      loaderRef.current?.destroy();
      loaderRef.current = null;

      // Navigate immediately with the response data:
      const navigationState = {
        projectId: state.projectId,
        selectedPackage: state.selectedPackage,
        selectedAddons: state.selectedAddons,
        totalPrice: state.totalPrice,
        clientSummary: response.planner.client_summary,
        websiteTemplate: response.planner.website_template,
        developerWorksheet: response.planner.developer_notes,
      };

      navigate('/dashboard/summary', {
        state: navigationState,
      });

      toast.success('Planning completed successfully!');
    } catch (error: any) {
      console.error('Planner submission error:', error);
      toast.error(error.message || 'Failed to process submission');
      setLoadingStage('initial');
      loaderRef.current?.destroy();
      loaderRef.current = null;
    }
  };

  if (loadingStage === 'processing') {
    return (
      <LoadingScreen
        message="Processing your requirements..."
        progress={50}
      />
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PlannerForm onSubmit={handleSubmit} />
    </div>
  );
};

export default PlannerPage;
