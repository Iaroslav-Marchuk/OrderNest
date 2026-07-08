import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetOrdersParams, OrderResponse } from '../types/order';
import { getArchivedOrdersApi } from '../services/ordersApi';

export const useArchivedOrders = (params: GetOrdersParams) => {
  const { data, isLoading, isError } = useQuery<OrderResponse>({
    queryKey: ['archivedOrders', params],
    queryFn: () => getArchivedOrdersApi(params),
    placeholderData: keepPreviousData,
  });

  return {
    orders: data?.orders ?? [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    isOrdersLoading: isLoading,
    isOrdersError: isError,
  };
};
