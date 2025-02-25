// src/features/projects/hooks/useProjectData.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/features/projects/api/projects.api';
import { packages } from '@/features/projects/constants/packages';
import { addons, enterpriseIncludedAddons } from '@/features/projects/constants/addons';
import { PackageType } from '@/features/projects/types/types';

/**
 * useProjectData
 * Fetches a project’s data with optimized settings.
 */
export const useProjectData = (projectId: number) => {
  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getProject(projectId),
    staleTime: 300000,
    cacheTime: 600000,
    refetchOnWindowFocus: false,
  });

  return {
    project,
    isLoading,
    isError,
    error,
  };
};

/**
 * useProjectsMutations
 * Consolidates createProject and saveAddons mutations with optimistic updates.
 */
export const useProjectsMutations = () => {
  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: (packageId: PackageType) => projectsApi.createProject(packageId),
    // Optimistically cancel any ongoing "projects" queries and cache previous value
    onMutate: async (packageId: PackageType) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);
      return { previousProjects };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const saveAddons = useMutation({
    mutationFn: ({
      projectId,
      addons,
    }: {
      projectId: number;
      addons: (string | number)[];
    }) => projectsApi.saveAddons(projectId, addons),
    onMutate: async ({ projectId, addons }) => {
      await queryClient.cancelQueries({ queryKey: ['project', projectId] });
      const previousProject = queryClient.getQueryData(['project', projectId]);
      // Optimistically update the project with new addons (adjust as needed)
      queryClient.setQueryData(['project', projectId], (old: any) => ({
        ...old,
        addons,
      }));
      return { previousProject };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousProject) {
        queryClient.setQueryData(['project', variables.projectId], context.previousProject);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { createProject, saveAddons };
};

/**
 * useProjectPackages
 * Returns the available packages and a createProject mutation.
 */
export const useProjectPackages = () => {
  const createProject = useMutation({
    mutationFn: (packageId: PackageType) => projectsApi.createProject(packageId),
    onSettled: () => {
      // Invalidate projects if needed
    },
  });

  return {
    packages,
    createProject,
    isPending: createProject.isLoading,
  };
};

/**
 * useProjectAddons
 * Returns available addons, enterprise defaults, and a saveAddons mutation with optimistic updates.
 */
export const useProjectAddons = () => {
  const queryClient = useQueryClient();
  const saveAddons = useMutation({
    mutationFn: ({
      projectId,
      addons,
    }: {
      projectId: number;
      addons: number[]; // or string[] depending on your backend
    }) => projectsApi.saveAddons(projectId, addons),
    onMutate: async ({ projectId, addons }) => {
      await queryClient.cancelQueries({ queryKey: ['project', projectId] });
      const previousProject = queryClient.getQueryData(['project', projectId]);
      queryClient.setQueryData(['project', projectId], (old: any) => ({
        ...old,
        addons,
      }));
      return { previousProject };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousProject) {
        queryClient.setQueryData(['project', variables.projectId], context.previousProject);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    addons,
    enterpriseIncludedAddons,
    saveAddons,
    isPending: saveAddons.isLoading,
  };
};

/**
 * useProjectCache
 * Provides methods to cache and invalidate project data.
 */
export const useProjectCache = (projectId: number) => {
  const queryClient = useQueryClient();
  return {
    cacheProject: (data: any) => {
      queryClient.setQueryData(['project', projectId], data);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      localStorage.setItem(`project_${projectId}_expires`, expiresAt.toISOString());
    },
    invalidateCache: () => {
      queryClient.invalidateQueries(['project', projectId]);
      localStorage.removeItem(`project_${projectId}_expires`);
    },
  };
};

/**
 * useProjectConstants
 * Quick access to package and addon constants.
 */
export const useProjectConstants = () => ({
  packages,
  addons,
  enterpriseIncludedAddons,
});
