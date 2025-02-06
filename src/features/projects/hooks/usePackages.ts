import { useMutation } from '@tanstack/react-query'
import { packages } from '../constants/packages'
import { projectsApi } from '../api/projects'
import { PackageType } from '../types/types'

export const usePackages = () => {
  const createProject = useMutation({
    mutationFn: (packageId: PackageType) => projectsApi.createProject(packageId),
  })

  return {
    packages,
    createProject,
    isPending: createProject.isPending
  }
}