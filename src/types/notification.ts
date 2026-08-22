export type NotificationType =
  | 'order_created'
  | 'order_started'
  | 'item_rejected'
  | 'order_completed';

export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  message: string;
  order: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}
