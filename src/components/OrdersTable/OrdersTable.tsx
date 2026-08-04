import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import css from './OrdersTable.module.css';

import type { Order, OrdersSortField } from '../../types/order';

import OrderRow from '../OrderRow/OrderRow';
import SkeletonOrders from '../SkeletonOrders/SkeletonOrders';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: OrdersSortField) => void;
}

function OrdersTable({
  orders,
  isLoading,
  isError,
  page,
  perPage,
  sortBy,
  sortOrder,
  onSortChange,
}: OrdersTableProps) {
  const getSortIcon = (field: OrdersSortField) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? (
        <ArrowUpNarrowWide size={14} strokeWidth={1.5} />
      ) : (
        <ArrowDownWideNarrow size={14} strokeWidth={1.5} />
      );
    }
    return <ArrowDownUp size={14} strokeWidth={1.5} />;
  };

  if (isError) return <p className={css.state}> Something went wrong!</p>;

  if (!isLoading && orders.length === 0)
    return <p className={css.state}> No orders found!</p>;

  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th className={css.th}>#</th>
          <th className={css.th}>
            <button className={css.thBtn} onClick={() => onSortChange('ep')}>
              EP {getSortIcon('ep')}
            </button>
          </th>

          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => onSortChange('client')}
            >
              Client {getSortIcon('client')}
            </button>
          </th>
          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => onSortChange('createdAt')}
            >
              Created at {getSortIcon('createdAt')}
            </button>
          </th>
          <th className={css.th}>Created on</th>
          <th className={css.th}>Created by</th>
          <th className={css.th}>Status</th>
          <th className={css.th}>Pending Items</th>
          <th className={css.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <SkeletonOrders />
        ) : (
          orders.map((order, index) => (
            <OrderRow
              key={order._id}
              order={order}
              index={(page - 1) * perPage + index + 1}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

export default OrdersTable;
