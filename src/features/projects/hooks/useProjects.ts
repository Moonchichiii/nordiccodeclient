// src/features/projects/hooks/useProjects.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../api/projects'
import { PackageType } from '../types/projects.types'

export const useProjects = () => {
  const queryClient = useQueryClient()

  const createProject = useMutation({
    mutationFn: (packageId: PackageType) => projectsApi.createProject(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  const saveAddons = useMutation({
    mutationFn: ({ projectId, addons }: { projectId: number; addons: number[] }) =>
      projectsApi.saveAddons(projectId, addons),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  return {
    createProject,
    saveAddons
  }
}