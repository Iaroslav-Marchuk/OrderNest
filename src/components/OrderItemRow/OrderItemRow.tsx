import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import EditOrderItemForm from '../EditOrderItemForm/EditOrderItemForm';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { deleteOrderItemApi } from '../../services/ordersApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import type { OrderItem } from '../../types/order';

import css from './OrderItemRow.module.css';

interface OrderItemRowProps {
  item: OrderItem;
  orderId: string;
}

function OrderItemRow({ item, orderId }: OrderItemRowProps) {
  const queryClient = useQueryClient();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: deleteOrderItem } = useMutation({
    mutationFn: deleteOrderItemApi,
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      if (response.data.orderDeleted) {
        queryClient.removeQueries({ queryKey: ['orderItems', orderId] });
        toast.success(
          'Item deleted — this was the last item, order was deleted too'
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['orderItems', orderId] });
        toast.success('Order item deleted successfully!');
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  return (
    <>
      <tr className={css.row}>
        <td className={css.td}>{item.type.label}</td>
        <td className={css.td}>{item.thickness} mm</td>
        <td className={css.td}>
          {item.sizeX} × {item.sizeY}
        </td>
        <td className={css.td}>{item.isTempered ? 'Yes' : 'No'}</td>
        <td className={css.td}>{item.quantity}</td>
        <td className={css.td}>{item.reason}</td>
        <td className={css.td}>{item.notes || '—'}</td>
        <td className={css.td}>{item.status}</td>
        <td className={css.td}>
          <div
            className={css.actionsCell}
            ref={dropdownRef}
            onClick={e => e.stopPropagation()}
          >
            <button
              className={css.menuBtn}
              onClick={() => setIsDropdownOpen(prev => !prev)}
            >
              <Ellipsis size={16} />
            </button>
            {isDropdownOpen && (
              <div className={css.menu}>
                <button
                  className={css.btn}
                  onClick={() => {
                    setIsEditOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  title="Edit"
                >
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button
                  className={css.btnDelete}
                  onClick={() => {
                    setIsConfirmOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  title="Delete"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {isEditOpen && (
        <ModalOverlay onClose={() => setIsEditOpen(false)}>
          <EditOrderItemForm
            item={item}
            orderId={orderId}
            onClose={() => setIsEditOpen(false)}
          />
        </ModalOverlay>
      )}

      {isConfirmOpen && (
        <ModalOverlay onClose={() => setIsConfirmOpen(false)}>
          <ConfirmContainer
            text={`Do you really want to delete this item?`}
            onConfirm={() => {
              deleteOrderItem({ orderId, itemId: item._id });
              setIsConfirmOpen(false);
            }}
            onClose={() => setIsConfirmOpen(false)}
          />
        </ModalOverlay>
      )}
    </>
  );
}

export default OrderItemRow;
