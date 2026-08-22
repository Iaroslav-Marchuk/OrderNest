import type {
  Notification,
  NotificationsResponse,
} from '../types/notification';
import { axiosInstance } from './axiosInstance';

export const getNotificationsApi = async (): Promise<NotificationsResponse> => {
  const { data } = await axiosInstance.get('/notifications');
  return data.data;
};

export const markNotificationReadApi = async (
  notificationId: string
): Promise<Notification> => {
  const { data } = await axiosInstance.patch(
    `/notifications/${notificationId}/read`
  );
  return data.data;
};

export const markAllNotificationsReadApi = async (): Promise<void> => {
  await axiosInstance.patch('/notifications/read-all');
};

export const clearReadNotificationsApi = async (): Promise<void> => {
  await axiosInstance.delete('/notifications/read');
};
