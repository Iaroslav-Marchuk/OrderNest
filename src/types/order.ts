export interface OrderItem {
  id: string;
  glassType: string;
  thickness: number;
  size: { width: number; height: number };
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  ep: string;
  client: string;
  createdAt: string;
  location: string;
  responsible: string;
  status:
    | 'pending'
    | 'cutting'
    | 'hardening'
    | 'assembly'
    | 'quality'
    | 'done'
    | 'cancelled';
  items: OrderItem[];
}
