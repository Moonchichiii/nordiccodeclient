import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packages } from '../constants/packages';
import { projectsApi } from '../api/projects';

export const usePackages = () => {
  const queryClient = useQueryClient();

  const { mutate: selectPackage, isPending } = useMutation({
    mutationFn: projectsApi.selectPackage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    packages,
    selectPackage,
    isPending,
  };
};
