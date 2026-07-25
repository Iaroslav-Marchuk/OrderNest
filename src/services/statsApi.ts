import type { StatsResponse } from '../types/stats';
import { axiosInstance } from './axiosInstance';

export const getStatsApi = async (): Promise<StatsResponse> => {
  const { data } = await axiosInstance.get<{
    message: string;
    data: StatsResponse;
  }>('/stats');
  return data.data;
};
