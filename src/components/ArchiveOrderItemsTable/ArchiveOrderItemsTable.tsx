import type { Order } from '../../types/order';

import { useOrderItems } from '../../hooks/useOrderItems';

import ArchiveOrderItemRow from '../ArchiveOrderItemRow/ArchiveOrderItemRow';
import SkeletonArchiveOrderItems from '../SkeletonArchiveOrderItems/SkeletonArchiveOrderItems';

import css from './ArchiveOrderItemsTable.module.css';

interface ArchiveOrderItemsTableProps {
  orderId: string;
  ownerId: string;
  orderStatus: Order['status'];
}

function ArchiveOrderItemsTable({
  orderId,
  ownerId,
  orderStatus,
}: ArchiveOrderItemsTableProps) {
  const { orderItems, isOrderItemsLoading } = useOrderItems(orderId);

  return (
    <div className={css.wrapper}>
      <table className={css.table}>
        <thead>
          <tr>
            <th className={css.th}>Glass</th>
            <th className={css.th}>Size (mm)</th>
            <th className={css.th}>Qty</th>
            <th className={css.th}>Reason</th>
            <th className={css.th}>Notes</th>
            <th className={css.th}>Completed</th>
          </tr>
        </thead>
        <tbody>
          {isOrderItemsLoading ? (
            <SkeletonArchiveOrderItems />
          ) : (
            orderItems.map(item => (
              <ArchiveOrderItemRow
                key={item._id}
                item={item}
                orderId={orderId}
                ownerId={ownerId}
                orderStatus={orderStatus}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ArchiveOrderItemsTable;
