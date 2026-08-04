import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  type ActivityLogsResponse,
  type GetActivityLogsParams,
} from '../types/activityLogs';
import { getActivityLogsApi } from '../services/activityLogsApi';

export const useActivityLogs = (params: GetActivityLogsParams) => {
  const { data, isLoading, isError } = useQuery<ActivityLogsResponse>({
    queryKey: ['activityLogs', params],
    queryFn: () => getActivityLogsApi(params),
    placeholderData: keepPreviousData,
  });

  return {
    activityLogs: data?.activityLogs ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    isActivityLogsLoading: isLoading,
    isActivityLogsError: isError,
  };
};
