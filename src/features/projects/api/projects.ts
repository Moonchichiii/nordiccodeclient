// src/features/projects/api/projects.ts
import axios, { AxiosError } from '@/lib/axios'
import { PackageType } from '@/features/projects/types/projects.types'

interface ICreateProjectResponse {
  id: number
  title: string
  description: string
  status: string
  package: {
    type: PackageType
    price_eur: string
  }
}

interface ICreateProjectPayload {
  title: string
  description: string
  package_id: PackageType
  addon_ids: number[]
}

export const projectsApi = {
  createProject: async (packageId: PackageType): Promise<ICreateProjectResponse> => {
    const payload: ICreateProjectPayload = {
      title: "Project Draft",
      description: "Initial project draft",
      package_id: packageId,
      addon_ids: []
    }

    console.group('Project Creation Attempt')
    console.log('Payload:', payload)
    console.log('URL:', '/api/projects/')
    
    try {
      const response = await axios.post<ICreateProjectResponse>('/api/projects/', payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Success Response:', response.data)
      console.groupEnd()
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<any>
      console.error('Project Creation Error:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          headers: axiosError.config?.headers,
          data: axiosError.config?.data
        }
      })
      console.groupEnd()
      throw axiosError.response?.data || axiosError
    }
  },

  saveAddons: async (projectId: number, addons: number[]): Promise<void> => {
    console.group('Save Addons Attempt')
    console.log('Project ID:', projectId)
    console.log('Addons:', addons)
    
    try {
      const response = await axios.post(`/api/projects/${projectId}/addons/`, {
        addons: addons
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Success Response:', response.data)
      console.groupEnd()
    } catch (error) {
      const axiosError = error as AxiosError<any>
      console.error('Save Addons Error:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          headers: axiosError.config?.headers,
          data: axiosError.config?.data
        }
      })
      console.groupEnd()
      throw axiosError.response?.data || axiosError
    }
  }
}