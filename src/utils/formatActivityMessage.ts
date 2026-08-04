import type { ActivityLog } from '../types/activityLogs';
import { formatLocation } from './formatLocationLabel';

const ACTION_LABELS: Record<string, string> = {
  order_created: 'create order',
  order_updated: 'update order',
  order_deleted: 'delete order',
  order_completed: 'complete order',
};

export function formatActivityMessage(log: ActivityLog): string {
  const { action, meta } = log;
  const actionLabel = ACTION_LABELS[action] ?? action;
  const epPart = meta?.ep ? `EP-${meta.ep}` : '';
  const locationPart = meta?.location
    ? `on ${formatLocation(meta.location as string)}`
    : '';

  return [actionLabel, epPart, locationPart].filter(Boolean).join(' ');
}
