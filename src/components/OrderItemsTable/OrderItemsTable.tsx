import css from './OrderItemsTable.module.css';

import SkeletonOrderItems from '../SkeletonOrderItems/SkeletonOrderItems';
import OrderItemRow from '../OrderItemRow/OrderItemRow';
import { useOrderItems } from '../../hooks/useOrderItems';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import AddOrderItemForm from '../AddOrderItemForm/AddOrderItemForm';
import type { Order } from '../../types/order';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface OrderItemsTableProps {
  orderId: string;
  ownerId: string;
  orderStatus: Order['status'];
}

function OrderItemsTable({
  orderId,
  ownerId,
  orderStatus,
}: OrderItemsTableProps) {
  const { orderItems, isOrderItemsLoading } = useOrderItems(orderId);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const { currentUser } = useCurrentUser();

  const isStarted = orderStatus !== 'created';
  const isOwner = currentUser?._id === ownerId;
  const isLocked = isStarted || !isOwner;

  const getLockReason = () => {
    if (isStarted) return 'Order already started production';
    if (!isOwner) return 'You can only manage your own orders';
    return undefined;
  };

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
            <th className={css.th}>Status</th>
            <th className={css.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isOrderItemsLoading ? (
            <SkeletonOrderItems />
          ) : (
            orderItems.map(item => (
              <OrderItemRow
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
      <button
        className={css.addItemBtn}
        onClick={e => {
          e.stopPropagation();
          setIsAddItemOpen(true);
        }}
        disabled={isLocked}
        title={getLockReason()}
      >
        <Plus size={14} /> Add item
      </button>

      {isAddItemOpen && (
        <ModalOverlay onClose={() => setIsAddItemOpen(false)}>
          <AddOrderItemForm
            orderId={orderId}
            onClose={() => setIsAddItemOpen(false)}
          />
        </ModalOverlay>
      )}
    </div>
  );
}

export default OrderItemsTable;
