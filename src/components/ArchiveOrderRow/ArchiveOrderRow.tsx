import { Fragment, useState } from 'react';
import type { Order } from '../../types/order';
import css from './ArchiveOrderRow.module.css';

import { ChevronDown } from 'lucide-react';
import OrderItemsTable from '../OrderItemsTable/OrderItemsTable';
import { formatLocation } from '../../utils/formatLocationLabel';

interface OrderRowProps {
  order: Order;
  index: number;
}

const STATUS_LABEL: Record<Order['status'], string> = {
  created: 'Created',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const STATUS_CLASS: Record<Order['status'], string> = {
  created: css.statusCreated,
  in_progress: css.statusInProgress,
  completed: css.statusCompleted,
};

function ArchiveOrderRow({ order, index }: OrderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Fragment>
      <tr className={css.row} onClick={() => setIsExpanded(prev => !prev)}>
        <td className={css.td}>
          <div className={css.rowIndex}>
            <button className={css.expandBtn}>
              <ChevronDown
                size={16}
                className={isExpanded ? css.iconOpen : css.icon}
              />
            </button>
            {index}
          </div>
        </td>
        <td className={css.td}>
          <span className={css.ep}>{order.ep}</span>
        </td>
        <td className={css.td}>{order.client?.name ?? '—'}</td>
        <td className={css.td}>
          <span className={`${css.status} ${STATUS_CLASS[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
        </td>
        <td className={css.td}>
          {new Date(order.createdAt).toLocaleDateString('pt-PT')}
        </td>
        <td className={css.td}>
          {order.location ? formatLocation(order.location) : '—'}
        </td>
        <td className={css.td}>
          <span className={css.responsible}>{order.owner?.name ?? '—'}</span>
        </td>

        <td className={css.td}>
          {order.completed?.at
            ? new Date(order.completed.at).toLocaleDateString('pt-PT')
            : '—'}
        </td>
        <td className={css.td}>
          {order.completed?.location
            ? formatLocation(order.completed.location)
            : '—'}
        </td>
        <td className={css.td}>
          <span className={css.responsible}>
            {order.completed?.by?.name ?? '—'}
          </span>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={10} className={css.expandCell}>
            <OrderItemsTable
              orderId={order._id}
              ownerId={order.owner?._id ?? ''}
              orderStatus={order.status}
              isArchive={true}
            />
          </td>
        </tr>
      )}
    </Fragment>
  );
}

export default ArchiveOrderRow;
