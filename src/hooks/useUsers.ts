import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getUsersApi } from '../services/usersApi';
import type { GetUsersParams, UserResponse } from '../types/user';

export const useUsers = (params: GetUsersParams) => {
  const { data, isLoading, isError } = useQuery<UserResponse>({
    queryKey: ['users', params],
    queryFn: () => getUsersApi(params),
    placeholderData: keepPreviousData,
  });

  return {
    users: data?.users ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    isUsersLoading: isLoading,
    isUsersError: isError,
  };
};
