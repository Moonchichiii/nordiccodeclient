import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { developerApi } from '../api/developer.api';
import { DeveloperWorksheet } from '../types/developer.types';

export const useDeveloperData = (projectId: number) => {
  const queryClient = useQueryClient();

  // Query for fetching worksheet data
  const { data, isLoading, error } = useQuery({
    queryKey: ['developer-worksheet', projectId],
    queryFn: () => developerApi.getWorksheet(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  // Mutation for updating notes
  const updateNotes = useMutation({
    mutationFn: (notes: string) => 
      developerApi.updateNotes(projectId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['developer-worksheet', projectId]);
    },
  });

  return {
    worksheet: data,
    isLoading,
    error,
    updateNotes,
  };
};