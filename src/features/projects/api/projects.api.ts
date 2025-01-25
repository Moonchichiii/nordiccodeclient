import axios from '@/lib/axios';
import { ProjectPackage, Project, ProjectPlan } from '../types';

export const projectApi = {
  // Package Management
  getPackages: () => 
    axios.get<ProjectPackage[]>('/api/projects/packages/'),
  
  selectPackage: (packageId: string) =>
    axios.post<Project>('/api/projects/', { package: packageId }),

  // Project Planning
  getPlan: (projectId: string) =>
    axios.get<ProjectPlan>(`/api/planner/plans/${projectId}/`),
  
  updatePlan: (projectId: string, planData: Partial<ProjectPlan>) =>
    axios.patch<ProjectPlan>(`/api/planner/plans/${projectId}/`, planData),

  submitPlanningStep: (projectId: string, stepId: string, data: any) =>
    axios.post(`/api/planner/plans/${projectId}/${stepId}/`, data),

  completePlanning: (projectId: string) =>
    axios.post(`/api/planner/plans/${projectId}/complete/`),

  // Payment Integration
  getOrderDetails: (projectId: string) => 
    axios.get(`/api/orders/project/${projectId}/`),
  
  processInitialPayment: (projectId: string, paymentMethod: string) =>
    axios.post(`/api/orders/project/${projectId}/process-deposit/`, {
      payment_method: paymentMethod
    })
};