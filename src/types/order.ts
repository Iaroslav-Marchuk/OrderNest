export interface OrderItem {
  _id: string;
  type: {
    _id: string;
    label: string;
    temper: 'required' | 'forbidden' | 'optional';
  };
  thickness: string;
  sizeX: number;
  sizeY: number;
  isTempered: boolean;
  quantity: number;
  reason: string;
  notes: string;
  status: 'created' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  ep: number;
  client: { _id: string; name: string };
  owner: { _id: string; name: string; role: string };
  location: string;
  status: 'created' | 'in_progress' | 'completed';
  itemsCount: number;
  itemsPendingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  orders: Order[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetOrdersParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: string;
  ep?: number | string;
  client?: string;
  status?: string;
  location?: string;
  date?: string;
}

export interface OrderExistsResponse {
  exists: boolean;
  orders?: Pick<
    Order,
    '_id' | 'ep' | 'location' | 'status' | 'createdAt' | 'client' | 'owner'
  >[];
}

export interface OrderItemFormValues {
  type: string;
  thickness: string;
  sizeX: number | '';
  sizeY: number | '';
  isTempered: boolean;
  quantity: number | '';
  reason: string;
  notes: string;
}

export interface OrderFormValues {
  ep: number | '';
  client: string;
  items: OrderItemFormValues[];
}

export interface EditOrderReq {
  orderId: string;
  updateData: Partial<Pick<Order, 'ep'> & { client: string }>;
}

export interface EditOrderItemReq {
  orderId: string;
  itemId: string;
  updateData: OrderItemFormValues;
}

export interface AddItemToOrderFormValues {
  orderId: string;
  itemData: OrderItemFormValues;
}

export interface DeleteOrderItemReq {
  orderId: string;
  itemId: string;
}

export interface DeleteOrderItemRes {
  message: string;
  data: {
    orderDeleted?: boolean;
    deletedItemId: string;
    updatedOrder?: Order;
  };
}

export interface UpdateOrderItemStatusReq {
  orderId: string;
  itemId: string;
  status: 'created' | 'in_progress' | 'completed';
}

export interface ClearArchiveRes {
  deletedOrders: number;
  deletedItems: number;
}
