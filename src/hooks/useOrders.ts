import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetOrdersParams, OrderResponse } from '../types/order';
import { getOrdersApi } from '../services/ordersApi';

export const useOrders = (params: GetOrdersParams) => {
  const { data, isLoading, isError } = useQuery<OrderResponse>({
    queryKey: ['orders', params],
    queryFn: () => getOrdersApi(params),
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
