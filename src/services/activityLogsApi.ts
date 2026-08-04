import { axiosInstance } from './axiosInstance';
import type {
  ActivityLogsResponse,
  GetActivityLogsParams,
} from '../types/activityLogs';

export const getActivityLogsApi = async (
  params: GetActivityLogsParams
): Promise<ActivityLogsResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== undefined && v !== null
    )
  );
  const { data } = await axiosInstance.get<{
    message: string;
    data: ActivityLogsResponse;
  }>('/activity', { params: cleanParams });

  return data.data;
};
