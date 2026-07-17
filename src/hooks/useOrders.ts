import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetOrdersParams, OrderResponse } from '../types/order';
import { getOrdersApi } from '../services/ordersApi';

export const useOrders = (params: GetOrdersParams) => {
  const apiParams: GetOrdersParams = {
    ...params,
    location: params.location === 'all' ? '' : params.location,
  };

  const { data, isLoading, isError } = useQuery<OrderResponse>({
    queryKey: ['orders', apiParams],
    queryFn: () => getOrdersApi(apiParams),
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
