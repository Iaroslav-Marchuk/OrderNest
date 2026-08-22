import type { Order, OrderItem } from '../../types/order';

import css from './ArchiveOrderItemRow.module.css';
import { formatGlassLabel, formatSize } from '../../utils/formatText';

import { formatLocation } from '../../utils/formatLocationLabel';

interface ArchiveOrderItemRowProps {
  item: OrderItem;
  orderId: string;
  ownerId: string;
  orderStatus: Order['status'];
}

function ArchiveOrderItemRow({ item }: ArchiveOrderItemRowProps) {
  return (
    <>
      <tr className={css.row}>
        <td className={css.td}>{formatGlassLabel(item)}</td>
        <td className={css.td}>{formatSize(item)}</td>
        <td className={css.td}>{item.quantity}</td>
        <td className={css.td}>{item.reason}</td>
        <td className={css.td}>{item.notes || '—'}</td>

        <td className={css.td}>
          <div className={css.info}>
            {item.completed?.at
              ? new Date(item.completed.at).toLocaleDateString('pt-PT')
              : '—'}
            <div className={css.subinfo}>
              {item.completed?.location
                ? formatLocation(item.completed.location)
                : '—'}
              {' · '}
              {item.completed?.by ? item.completed.by.name : '—'}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export default ArchiveOrderItemRow;
