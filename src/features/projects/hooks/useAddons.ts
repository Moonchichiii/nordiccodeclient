import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../api/projects'
import { addons, enterpriseIncludedAddons } from '../constants/addons'

interface SaveAddonsParams {
  packageId: string
  selectedAddons: Set<string>
}

export const useAddons = () => {
  const queryClient = useQueryClient()

  const saveAddons = useMutation({
    mutationFn: ({ projectId, addons }: { projectId: number; addons: number[] }) =>
      projectsApi.saveAddons(projectId, addons),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  return {
    addons,
    enterpriseIncludedAddons,
    saveAddons,
    isPending: saveAddons.isPending
  }
}