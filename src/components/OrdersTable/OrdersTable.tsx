import { ChevronDown, Ellipsis } from 'lucide-react';
import css from './OrdersTable.module.css';
import { Fragment, useState } from 'react';
import OrderItemsTable from '../OrderItemsTable/OrderItemsTable';
import type { Order } from '../../types/order';

const STATUS_LABEL: Record<Order['status'], string> = {
  pending: 'Pending',
  cutting: 'Cutting',
  hardening: 'Hardening',
  assembly: 'Assembly',
  quality: 'Quality',
  done: 'Done',
  cancelled: 'Cancelled',
};

const STATUS_CLASS: Record<Order['status'], string> = {
  pending: css.statusPending,
  cutting: css.statusCutting,
  hardening: css.statusHardening,
  assembly: css.statusAssembly,
  quality: css.statusQuality,
  done: css.statusDone,
  cancelled: css.statusCancelled,
};

interface OrdersTableProps {
  orders: Order[];
}

function OrdersTable({ orders = [] }: OrdersTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th className={css.th}>
            <button className={css.thBtn}>
              <ChevronDown />
            </button>
          </th>
          <th className={css.th}>EP</th>
          <th className={css.th}>Cliente</th>
          <th className={css.th}>Created At</th>
          <th className={css.th}>Location</th>
          <th className={css.th}>Responsible</th>
          <th className={css.th}>Status</th>
          <th className={css.th}>Items</th>
          <th className={css.th}>
            <button className={css.thBtn}>
              <Ellipsis />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <Fragment key={order.id}>
            <tr className={css.row} onClick={() => toggle(order.id)}>
              <td className={css.td}>
                <button className={css.expandBtn}>
                  <ChevronDown
                    size={16}
                    className={
                      expandedIds.has(order.id) ? css.iconOpen : css.icon
                    }
                  />
                </button>
              </td>
              <td className={css.td}>
                <span className={css.ep}>{order.ep}</span>
              </td>
              <td className={css.td}>{order.client}</td>
              <td className={css.td}>
                {new Date(order.createdAt).toLocaleDateString('pt-PT')}
              </td>
              <td className={css.td}>{order.location}</td>
              <td className={css.td}>
                <span className={css.responsible}>{order.responsible}</span>
              </td>
              <td className={css.td}>
                <span className={`${css.status} ${STATUS_CLASS[order.status]}`}>
                  {STATUS_LABEL[order.status]}
                </span>
              </td>
              <td className={css.td}>
                <span className={css.itemsCount}>{order.items.length}</span>
              </td>
              <td className={css.td}>
                <button
                  className={css.menuBtn}
                  onClick={e => e.stopPropagation()}
                >
                  <Ellipsis size={16} />
                </button>
              </td>
            </tr>
            {expandedIds.has(order.id) && (
              <tr>
                <td colSpan={9} className={css.expandCell}>
                  <OrderItemsTable items={order.items} />
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default OrdersTable;
