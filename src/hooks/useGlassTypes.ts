import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type {
  GetGlassTypesParams,
  GlassTypeResponse,
} from '../types/glassType';
import { getGlassTypesApi } from '../services/glassTypesApi';

export const useGlassTypes = (params: GetGlassTypesParams) => {
  const { data, isLoading, isError } = useQuery<GlassTypeResponse>({
    queryKey: ['glassTypes', params],
    queryFn: () => getGlassTypesApi(params),
    placeholderData: keepPreviousData,
  });

  return {
    glassTypes: data?.glassTypes ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    isGlassTypesLoading: isLoading,
    isGlassTypesError: isError,
  };
};
