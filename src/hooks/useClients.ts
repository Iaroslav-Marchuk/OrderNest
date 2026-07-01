import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getClientsApi } from '../services/clientsApi';
import type { ClientResponse, GetClientsParams } from '../types/client';

export const useClients = (params: GetClientsParams) => {
  const { data, isLoading, isError } = useQuery<ClientResponse>({
    queryKey: ['clients', params],
    queryFn: () => getClientsApi(params),
    placeholderData: keepPreviousData,
  });

  return {
    clients: data?.clients ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    isClientsLoading: isLoading,
    isClientsError: isError,
  };
};
