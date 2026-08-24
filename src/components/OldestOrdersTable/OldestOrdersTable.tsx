import { formatLocation } from '../../utils/formatLocationLabel';

import css from './OldestOrdersTable.module.css';

interface OldestOrder {
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

interface OldestOrdersTableProps {
  orders: OldestOrder[];
}

type DaysUrgency = 'normal' | 'warning' | 'critical';

const DAYS_URGENCY_CLASS: Record<DaysUrgency, string> = {
  normal: css.daysNormal,
  warning: css.daysWarning,
  critical: css.daysCritical,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB');
}

function OldestOrdersTable({ orders }: OldestOrdersTableProps) {
  function getDaysUrgency(days: number): DaysUrgency {
    if (days >= 7) return 'critical';
    if (days >= 4) return 'warning';
    return 'normal';
  }

  return (
    <table className={css.table}>
      <thead>
        <tr>
          <th>Order #</th>
          <th>Client</th>
          <th>Line</th>
          <th>Created</th>
          <th>Days in progress</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.orderNumber}</td>
            <td>{order.client.name}</td>
            <td>{formatLocation(order.line)}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td
              className={`${css.daysCell} ${DAYS_URGENCY_CLASS[getDaysUrgency(order.daysInProgress)]}`}
            >
              {order.daysInProgress}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OldestOrdersTable;
