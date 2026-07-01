import { useQuery } from '@tanstack/react-query';
import type { Client } from '../types/client';
import { getAllClientsApi } from '../services/clientsApi';

export const useAllClients = () => {
  const { data, isLoading, isError } = useQuery<Client[]>({
    queryKey: ['allClients'],
    queryFn: () => getAllClientsApi(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    allClients: data ?? [],
    isAllCientsLoading: isLoading,
    isAllClientsError: isError,
  };
};
