import { ArrowBigRight, Ellipsis, Pencil, Trash2 } from 'lucide-react';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import EditOrderItemForm from '../EditOrderItemForm/EditOrderItemForm';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import {
  deleteOrderItemApi,
  updateOrderItemStatusApi,
} from '../../services/ordersApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import type { Order, OrderItem } from '../../types/order';

import css from './OrderItemRow.module.css';
import { formatGlassLabel, formatSize } from '../../utils/formatText';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface OrderItemRowProps {
  item: OrderItem;
  orderId: string;
  ownerId: string;
  orderStatus: Order['status'];
}

const STATUS_FLOW: OrderItem['status'][] = [
  'created',
  'in_progress',
  'completed',
];

const STATUS_LABEL: Record<OrderItem['status'], string> = {
  created: 'Created',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const STATUS_CLASS: Record<OrderItem['status'], string> = {
  created: css.statusCreated,
  in_progress: css.statusInProgress,
  completed: css.statusCompleted,
};

const getNextStatus = (
  current: OrderItem['status']
): OrderItem['status'] | null => {
  const currentIndex = STATUS_FLOW.indexOf(current);
  if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) {
    return null;
  }
  return STATUS_FLOW[currentIndex + 1];
};

const canAdvanceStatus = (
  nextStatus: OrderItem['status'] | null,
  role: string
): boolean => {
  if (!nextStatus) return false;
  if (nextStatus === 'in_progress') return role === 'cutting';
  if (nextStatus === 'completed') return role === 'assembly';
  return false;
};

function OrderItemRow({
  item,
  orderId,
  ownerId,
  orderStatus,
}: OrderItemRowProps) {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isStarted = orderStatus !== 'created';
  const isOwner = currentUser?._id === ownerId;
  const isEditLocked = isStarted || !isOwner;

  const getEditLockReason = () => {
    if (isStarted) return 'Order already started production';
    if (!isOwner) return 'You can only manage your own orders';
    return undefined;
  };

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

  const { mutate: changeStatus, isPending: isStatusPending } = useMutation({
    mutationFn: updateOrderItemStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderItems', orderId] });
      toast.success('Status updated!');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const nextStatus = getNextStatus(item.status);
  const canAdvance = canAdvanceStatus(nextStatus, currentUser?.role ?? '');

  const handleStatusChange = () => {
    if (!nextStatus || !canAdvance) return;
    changeStatus({ orderId, itemId: item._id, status: nextStatus });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <tr className={css.row}>
        <td className={css.td}>{formatGlassLabel(item)}</td>
        <td className={css.td}>{formatSize(item)}</td>
        <td className={css.td}>{item.quantity}</td>
        <td className={css.td}>{item.reason}</td>
        <td className={css.td}>{item.notes || '—'}</td>
        <td className={css.td}>
          <span className={`${css.status} ${STATUS_CLASS[item.status]}`}>
            {STATUS_LABEL[item.status]}
          </span>
        </td>
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
                  className={css.btnstatus}
                  onClick={handleStatusChange}
                  disabled={!canAdvance || isStatusPending}
                  title={
                    nextStatus
                      ? canAdvance
                        ? `Move to ${STATUS_LABEL[nextStatus]}`
                        : 'You do not have permission for this action'
                      : 'Already completed'
                  }
                >
                  <ArrowBigRight size={16} strokeWidth={1.5} />
                </button>

                <button
                  className={css.btn}
                  onClick={() => {
                    setIsEditOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  disabled={isEditLocked}
                  title={getEditLockReason() ?? 'Edit'}
                >
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button
                  className={css.btnDelete}
                  onClick={() => {
                    setIsConfirmOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  disabled={isEditLocked}
                  title={getEditLockReason() ?? 'Delete'}
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
