import { useQuery } from '@tanstack/react-query';
import type { GlassType } from '../types/glassType';
import { getAllGlassTypesApi } from '../services/glassTypesApi';
import { useMemo } from 'react';

export const useAllGlassTypes = () => {
  const { data, isLoading, isError } = useQuery<GlassType[]>({
    queryKey: ['allGlassTypes'],
    queryFn: () => getAllGlassTypesApi(),
    staleTime: 5 * 60 * 1000,
  });

  const lastGlassType = useMemo(() => {
    if (!data?.length) return null;
    return [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [data]);

  return {
    allGlassTypes: data ?? [],
    lastGlassType,
    isAllGlassTypesLoading: isLoading,
    isAllGlassTypesError: isError,
  };
};
