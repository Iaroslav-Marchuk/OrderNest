import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  clearReadNotificationsApi,
  getNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from '../services/notificationsApi';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsApi,
    refetchInterval: 30 * 1000,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: markAllNotificationsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const { mutate: clearRead } = useMutation({
    mutationFn: clearReadNotificationsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    isNotificationsLoading: isLoading,
    markAsRead,
    markAllAsRead,
    clearRead,
  };
};
