import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { StatsResponse } from '../types/stats';
import { getStatsApi } from '../services/statsApi';

export const useStats = () => {
  const { data, isLoading, isError } = useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: () => getStatsApi(),
    placeholderData: keepPreviousData,
  });

  return {
    data,
    isStatsLoading: isLoading,
    isStatsError: isError,
  };
};
