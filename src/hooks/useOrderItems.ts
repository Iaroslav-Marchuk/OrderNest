import { useQuery } from '@tanstack/react-query';
import type { OrderItem } from '../types/order';
import { getOrderItemsApi } from '../services/ordersApi';

export const useOrderItems = (orderId: string) => {
  const { data, isLoading, isError } = useQuery<OrderItem[]>({
    queryKey: ['orderItems', orderId],
    queryFn: () => getOrderItemsApi(orderId),
  });

  return {
    orderItems: data ?? [],
    isOrderItemsLoading: isLoading,
    isOrderItemsError: isError,
  };
};
