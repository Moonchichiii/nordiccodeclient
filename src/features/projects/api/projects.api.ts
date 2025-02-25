// src/features/projects/api/projects.api.ts
import axios, { AxiosError } from '@/lib/axios';
import { PackageType, PackageData, Addon } from '@/features/projects/types/types';
import { toCents, fromCents } from '@/features/projects/utils/index';

// Response Types
interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  package: {
    type: PackageType;
    price_eur_cents: number;
    price_sek_ore: number;
  };
  total_price_eur_cents: number;
}

interface AddonResponse {
  id: string;
  is_included: boolean;
}

// Request Payloads
interface CreateProjectPayload {
  title: string;
  description: string;
  package_id: PackageType;
  addon_ids: string[];
  is_draft: boolean;
}

interface SaveAddonsPayload {
  addons: string[];
  package_id?: PackageType;
}

// Error handling utility
const handleApiError = (error: unknown, context: string) => {
  console.group(`API Error: ${context}`);
  if (error instanceof AxiosError) {
    console.error({
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
  } else {
    console.error('Unexpected error:', error);
  }
  console.groupEnd();
  throw error;
};

interface CachedResponse {
  data: ProjectResponse;
  timestamp: number;
}

class ProjectsAPI {
  private baseURL = '/api/projects/';
  private cache = new Map<string, CachedResponse>();

  async createProject(packageId: PackageType, draft = true): Promise<ProjectResponse> {
    const payload: CreateProjectPayload = {
      title: "Project Draft",
      description: "Initial project draft",
      package_id: packageId,
      addon_ids: [],
      is_draft: draft
    };

    try {
      const response = await axios.post<ProjectResponse>(
        this.baseURL,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Cache the response
      this.cache.set(`project_${response.data.id}`, {
        data: response.data,
        timestamp: Date.now()
      });

      return response.data;
    } catch (error) {
      handleApiError(error, 'Project Creation');
    }
  }

  async saveAddons(
    projectId: number, 
    addons: string[], 
    packageType?: PackageType
  ): Promise<{ addons: AddonResponse[]; total_price_eur_cents: number }> {
    console.group('Save Addons');
    console.log('Project ID:', projectId);
    console.log('Addons:', addons);
    
    try {
      const payload: SaveAddonsPayload = {
        addons,
        ...(packageType && { package_id: packageType })
      };

      const response = await axios.post(
        `${this.baseURL}/${projectId}/addons/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Success:', response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      handleApiError(error, 'Save Addons');
    }
  }

  async validatePricing(packageId: PackageType, frontendPrice: number): Promise<boolean> {
    try {
      const response = await axios.get<{ price_eur_cents: number }>(
        `${this.baseURL}/packages/${packageId}/price`
      );
      
      const backendPriceEUR = fromCents(response.data.price_eur_cents);
      return Math.abs(backendPriceEUR - frontendPrice) < 0.01; // Allow for small floating point differences
    } catch (error) {
      handleApiError(error, 'Price Validation');
    }
  }
}

export const projectsApi = new ProjectsAPI();

// Export type for use in components
export type { ProjectResponse, AddonResponse };
