import { useQuery } from '@tanstack/react-query';
import type { Client } from '../types/client';
import { getAllClientsApi } from '../services/clientsApi';
import { useMemo } from 'react';

export const useAllClients = () => {
  const { data, isLoading, isError } = useQuery<Client[]>({
    queryKey: ['allClients'],
    queryFn: () => getAllClientsApi(),
    staleTime: 5 * 60 * 1000,
  });

  const lastClient = useMemo(() => {
    if (!data?.length) return null;
    return [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [data]);

  return {
    allClients: data ?? [],
    lastClient,
    isAllCientsLoading: isLoading,
    isAllClientsError: isError,
  };
};
