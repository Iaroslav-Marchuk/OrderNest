import { useQuery } from '@tanstack/react-query';
import type { User } from '../types/user';
import { getCurrentUserApi } from '../services/authApi';
import {
  getAccessToken,
  subscribeToAccessToken,
} from '../services/axiosInstance';
import { useSyncExternalStore } from 'react';

export const useCurrentUser = () => {
  const token = useSyncExternalStore(subscribeToAccessToken, getAccessToken);

  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserApi,
    enabled: !!token,
    retry: false,
  });

  return {
    currentUser,
    isUserLoading: isLoading,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    location: currentUser?.location ?? null,
  };
};
