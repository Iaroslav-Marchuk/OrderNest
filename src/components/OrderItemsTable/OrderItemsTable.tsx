import css from './OrderItemsTable.module.css';

import SkeletonOrderItems from '../SkeletonOrderItems/SkeletonOrderItems';
import OrderItemRow from '../OrderItemRow/OrderItemRow';
import { useOrderItems } from '../../hooks/useOrderItems';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import AddOrderItemForm from '../AddOrderItemForm/AddOrderItemForm';

interface OrderItemsTableProps {
  orderId: string;
}

function OrderItemsTable({ orderId }: OrderItemsTableProps) {
  const { orderItems, isOrderItemsLoading } = useOrderItems(orderId);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

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
              <OrderItemRow key={item._id} item={item} orderId={orderId} />
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
