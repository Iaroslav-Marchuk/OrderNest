import { useQuery } from '@tanstack/react-query';
import type { GlassType } from '../types/glassType';
import { getAllGlassTypesApi } from '../services/glassTypesApi';

export const useAllGlassTypes = () => {
  const { data, isLoading, isError } = useQuery<GlassType[]>({
    queryKey: ['allGlassTypes'],
    queryFn: () => getAllGlassTypesApi(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    allGlassTypes: data ?? [],
    isAllGlassTypesLoading: isLoading,
    isAllGlassTypesError: isError,
  };
};
