// src/features/projects/context/ProjectContext.tsx
interface ProjectState {
    currentStep: number;
    flow: 'package' | 'addons' | 'planner' | 'summary';
    metadata: {
      id?: number;
      status: string;
      lastUpdated: string;
      expiresAt: string;
    };
    packageDetails: {
      selectedPackage: PackageData | null;
      selectedAddons: Set<string>;
      pricing: {
        totalEUR: number;
        totalEURCents: number;
      };
    };
    plannerData: PlannerState;
    completionStatus: {
      package: boolean;
      addons: boolean;
      planner: boolean;
      payment: boolean;
    };
  }