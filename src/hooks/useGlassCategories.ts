import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type {
  GetGlassCategoriesParams,
  GlassCategoryResponse,
} from '../types/glassCategory';
import { getGlassCategoriesApi } from '../services/glassCategoriesApi';

export const useGlassCategories = (params: GetGlassCategoriesParams) => {
  const { data, isLoading, isError } = useQuery<GlassCategoryResponse>({
    queryKey: ['glassCategories', params],
    queryFn: () => getGlassCategoriesApi(params),
    placeholderData: keepPreviousData,
  });

  return {
    glassCategories: data?.glassCategories ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    isGlassCategoriesLoading: isLoading,
    isGlassCategoriesError: isError,
  };
};
