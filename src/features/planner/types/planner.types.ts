// src/features/planner/types/planner.types.ts
export interface ProjectPhase {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'in-progress' | 'completed';
    dependencies: string[];
    milestones: string[];
  }
  
  export interface ResourceAllocation {
    type: string;
    allocated: number;
    available: number;
    assignee?: string;
  }
  
  export interface WorkloadItem {
    week: string;
    development: number;
    design: number;
    content: number;
    maxCapacity: number;
  }
  
  export interface Deadline {
    projectName: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
  }
  
  export interface ProjectTimeline {
    phases: ProjectPhase[];
    currentPhase: ProjectPhase | null;
  }
  
  export interface ServicePackage {
    id: string;
    name: string;
    basePrice: {
      min: number;
      max: number;
      currency: string;
    };
    features: {
      technical: string[];
      design: string[];
      optimization: string[];
      support: string[];
    };
    timeframe: string;
    deliverables: string[];
  }
  
  export interface ProjectPlan {
    selectedPackage: ServicePackage;
    addons: string[];
    timeline: ProjectTimeline;
    resources: ResourceAllocation[];
    totalCost: number;
    estimatedDuration: number;
  }
  
  export interface PlannerState {
    currentStep: number;
    plan: ProjectPlan | null;
    error: string | null;
    isLoading: boolean;
  }