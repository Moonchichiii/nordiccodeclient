export interface ProjectPackage {
    id: string;
    name: string;
    base_price: number;
    features: Record<string, any>;
    tech_stack: string[];
    deliverables: string[];
    estimated_duration: number;
    maintenance_period: number;
    sla_response_time: number;
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    package: ProjectPackage;
    status: string;
    planning_completed: boolean;
    planning_locked: boolean;
    created_at: string;
  }
  
  export interface ProjectPlan {
    id: string;
    project: string;
    requirements_analysis: Record<string, any>;
    tech_recommendations: Record<string, any>;
    design_preferences: Record<string, any>;
    timeline_estimation: Record<string, any>;
    ai_suggestions: Record<string, any>;
    created_at: string;
    updated_at: string;
  }