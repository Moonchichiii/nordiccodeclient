import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../api/projects'
import { addons, enterpriseIncludedAddons } from '../constants/addons'

interface SaveAddonsParams {
  packageId: string
  selectedAddons: Set<string>
}

export const useAddons = () => {
  const queryClient = useQueryClient()

  const { mutate: saveAddons, isPending } = useMutation({
    mutationFn: ({ packageId, selectedAddons }: SaveAddonsParams) => 
      projectsApi.saveAddons({
        package_id: packageId,
        addons: Array.from(selectedAddons)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  return {
    addons,
    enterpriseIncludedAddons,
    saveAddons,
    isPending
  }
}