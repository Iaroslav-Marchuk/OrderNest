import { useQuery } from '@tanstack/react-query';
import type { User } from '../types/user';
import { getCurrentUserApi } from '../services/authApi';
import { getAccessToken } from '../services/axiosInstance';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: string;
  role: string;
  location: string | null;
}

const getTokenPayload = (): JwtPayload | null => {
  const token = getAccessToken();
  if (!token) return null;
  return jwtDecode<JwtPayload>(token);
};

export const useCurrentUser = () => {
  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserApi,
    enabled: !!getAccessToken(),
    retry: false,
  });

  const payload = getTokenPayload();

  return {
    currentUser,
    isUserLoading: isLoading,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    location: payload?.location ?? null,
  };
};
