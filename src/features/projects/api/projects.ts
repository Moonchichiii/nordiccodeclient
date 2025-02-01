import axios from '@/lib/axios'

interface SaveAddonsPayload {
  package_id: string
  addons: string[]
}

export const projectsApi = {
  selectPackage: async (packageId: string) => {
    const { data } = await axios.post('/api/projects/', { package_id: packageId })
    return data
  },

  saveAddons: async (payload: SaveAddonsPayload) => {
    const { data } = await axios.post('/api/projects/addons', payload)
    return data
  }
}