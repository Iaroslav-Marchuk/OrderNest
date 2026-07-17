import type {
  AddItemToOrderFormValues,
  ClearArchiveRes,
  DeleteOrderItemReq,
  DeleteOrderItemRes,
  EditOrderItemReq,
  EditOrderReq,
  GetOrdersParams,
  Order,
  OrderExistsResponse,
  OrderFormValues,
  OrderItem,
  OrderItemStatusReq,
  OrderResponse,
} from '../types/order';
import { axiosInstance } from './axiosInstance';

export const getOrdersApi = async (
  params: GetOrdersParams
): Promise<OrderResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== undefined && v !== null
    )
  );
  const { data } = await axiosInstance.get<{
    message: string;
    data: OrderResponse;
  }>('/orders', { params: cleanParams });

  return data.data;
};

export const getArchivedOrdersApi = async (
  params: GetOrdersParams
): Promise<OrderResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== undefined && v !== null
    )
  );
  const { data } = await axiosInstance.get<{
    message: string;
    data: OrderResponse;
  }>('/orders/archive', { params: cleanParams });

  return data.data;
};

export const checkOrderExistsApi = async (
  ep: number
): Promise<OrderExistsResponse> => {
  const { data } = await axiosInstance.get<{
    message: string;
    data: OrderExistsResponse;
  }>(`/orders/check-ep/${ep}`);
  return data.data;
};

export const createOrderApi = async (
  orderData: OrderFormValues
): Promise<Order> => {
  const { data } = await axiosInstance.post<{
    message: string;
    data: { order: Order };
  }>('/orders', orderData);

  return data.data.order;
};

export const patchOrderApi = async ({
  orderId,
  updateData,
}: EditOrderReq): Promise<Order> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedOrder: Order };
  }>(`/orders/${orderId}`, updateData);

  return data.data.updatedOrder;
};

export const addItemToOrderApi = async ({
  orderId,
  itemData,
}: AddItemToOrderFormValues): Promise<OrderItem> => {
  const { data } = await axiosInstance.post<{
    message: string;
    data: { createdItem: OrderItem };
  }>(`/orders/${orderId}/items`, itemData);

  return data.data.createdItem;
};

export const deleteOrderApi = async (orderId: string): Promise<void> => {
  await axiosInstance.delete(`/orders/${orderId}`);
};

export const getOrderItemsApi = async (
  orderId: string
): Promise<OrderItem[]> => {
  const { data } = await axiosInstance.get<{
    message: string;
    data: { items: OrderItem[] };
  }>(`/orders/${orderId}/items`);
  return data.data.items;
};

export const patchOrderItemApi = async ({
  orderId,
  itemId,
  updateData,
}: EditOrderItemReq): Promise<OrderItem> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedItem: OrderItem };
  }>(`/orders/${orderId}/items/${itemId}`, updateData);

  return data.data.updatedItem;
};

export const deleteOrderItemApi = async ({
  orderId,
  itemId,
}: DeleteOrderItemReq): Promise<DeleteOrderItemRes> => {
  const { data } = await axiosInstance.delete(
    `/orders/${orderId}/items/${itemId}`
  );
  return data;
};

export const startOrderItemApi = async ({
  orderId,
  itemId,
}: OrderItemStatusReq): Promise<OrderItem> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedItem: OrderItem };
  }>(`/orders/${orderId}/items/${itemId}/start`);
  return data.data.updatedItem;
};

export const completeOrderItemApi = async ({
  orderId,
  itemId,
}: OrderItemStatusReq): Promise<OrderItem> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedItem: OrderItem };
  }>(`/orders/${orderId}/items/${itemId}/complete`);
  return data.data.updatedItem;
};

export const rejectOrderItemApi = async ({
  orderId,
  itemId,
}: OrderItemStatusReq): Promise<OrderItem> => {
  const { data } = await axiosInstance.patch<{
    message: string;
    data: { updatedItem: OrderItem };
  }>(`/orders/${orderId}/items/${itemId}/reject`);
  return data.data.updatedItem;
};

export const clearArchiveApi = async (): Promise<ClearArchiveRes> => {
  const { data } = await axiosInstance.delete<{
    message: string;
    data: ClearArchiveRes;
  }>('/orders/archive');
  return data.data;
};

export const deleteArchivedOrderApi = async (
  orderId: string
): Promise<Order> => {
  const { data } = await axiosInstance.delete<{
    message: string;
    data: Order;
  }>(`/orders/archive/${orderId}`);
  return data.data;
};
