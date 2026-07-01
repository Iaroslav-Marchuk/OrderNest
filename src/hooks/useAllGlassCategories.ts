import { useQuery } from '@tanstack/react-query';
import type { GlassCategory } from '../types/glassCategory';
import { getAllGlassCategoriesApi } from '../services/glassCategoriesApi';

export const useAllGlassCategories = () => {
  const { data, isLoading, isError } = useQuery<GlassCategory[]>({
    queryKey: ['allGlassCategories'],
    queryFn: () => getAllGlassCategoriesApi(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    allGlassCategories: data ?? [],
    isAllGlassCategoriesLoading: isLoading,
    isAllGlassCategoriesError: isError,
  };
};
