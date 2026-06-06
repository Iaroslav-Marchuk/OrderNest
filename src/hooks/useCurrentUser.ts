import { useQuery } from '@tanstack/react-query';
import type { User } from '../types/user';
import { getCurrentUserApi } from '../services/authApi';
import { getAccessToken } from '../services/axiosInstance';

export const useCurrentUser = () => {
  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserApi,
    enabled: !!getAccessToken(),
    retry: false,
  });

  return {
    currentUser,
    isLoading,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
  };
};
