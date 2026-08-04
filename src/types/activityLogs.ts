export type ActivityLogsSortField = 'createdAt' | 'user';

export interface ActivityLog {
  _id: string;
  user: { _id: string; name: string; role: string } | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
}

export interface ActivityLogsResponse {
  activityLogs: ActivityLog[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetActivityLogsParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: string;
  userId?: string;
  date?: string;
}
