interface OldestActiveOrder {
  ep: number;
  createdAt: string;
  clientName: string | null;
  location: string;
}

export interface OrdersTrendPoint {
  date: string;
  created: number;
  completed: number;
}

export interface OrdersPerLine {
  location: string;
  value: number;
}

export interface AvgCompletionTimePerLine {
  location: string;
  value: number;
}

export interface OldestOrders {
  id: string;
  orderNumber: string;
  client: {
    _id: string;
    name: string;
  };
  line: string;
  createdAt: string;
  daysInProgress: number;
}

export interface StatsResponse {
  activeOrders: number;
  completedToday: number;
  createdToday: number;
  delayedOrders: number;
  averageCompletionHours: number;
  oldestActiveOrder: OldestActiveOrder | null;
  ordersTrend: OrdersTrendPoint[];
  ordersPerLine: OrdersPerLine[];
  avgCompletionTimePerLine: AvgCompletionTimePerLine[];
  oldestOrders: OldestOrders[];
}
