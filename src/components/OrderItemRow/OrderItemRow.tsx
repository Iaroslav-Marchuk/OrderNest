import { Check, Ellipsis, Pencil, Play, Trash2, X } from 'lucide-react';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import EditOrderItemForm from '../EditOrderItemForm/EditOrderItemForm';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import {
  completeOrderItemApi,
  deleteOrderItemApi,
  rejectOrderItemApi,
  startOrderItemApi,
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

const STATUS_LABEL: Record<OrderItem['status'], string> = {
  created: 'Created',
  in_progress: 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
};

const STATUS_CLASS: Record<OrderItem['status'], string> = {
  created: css.statusCreated,
  in_progress: css.statusInProgress,
  completed: css.statusCompleted,
  rejected: css.statusRejected,
};

const LOCATION_LABEL: Record<'line_1' | 'line_2' | 'line_3', string> = {
  line_1: 'Line 1',
  line_2: 'Line 2',
  line_3: 'Line 3',
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
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOrderStarted = orderStatus !== 'created';
  const isOwner = currentUser?._id === ownerId;
  const isEditLocked = isOrderStarted || !isOwner;

  const getEditLockReason = () => {
    if (isOrderStarted) return 'Order already started production';
    if (!isOwner) return 'You can only manage your own orders';
    return undefined;
  };

  const canStart = item.status === 'created' && currentUser?.role === 'cutting';
  const canCompleteOrReject =
    item.status === 'in_progress' && currentUser?.role === 'assembly';

  const invalidateAfterStatusChange = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['orderItems', orderId] });
  };

  const handleMutationError = (error: AxiosError<{ message: string }>) => {
    const message = error.response?.data?.message;
    toast.error(message ?? 'Something went wrong!');
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
    onError: handleMutationError,
  });

  const { mutate: startItem, isPending: isStartPending } = useMutation({
    mutationFn: startOrderItemApi,
    onSuccess: () => {
      invalidateAfterStatusChange();
      toast.success('Item started!');
    },
    onError: handleMutationError,
  });

  const { mutate: completeItem, isPending: isCompletePending } = useMutation({
    mutationFn: completeOrderItemApi,
    onSuccess: () => {
      invalidateAfterStatusChange();
      toast.success('Item completed!');
    },
    onError: handleMutationError,
  });

  const { mutate: rejectItem, isPending: isRejectPending } = useMutation({
    mutationFn: rejectOrderItemApi,
    onSuccess: () => {
      invalidateAfterStatusChange();
      toast.success('Item rejected — a rework item was created');
    },
    onError: handleMutationError,
  });

  const isStatusActionPending =
    isStartPending || isCompletePending || isRejectPending;

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
          {item.completed?.at
            ? new Date(item.completed.at).toLocaleDateString('pt-PT')
            : '—'}
        </td>
        <td className={css.td}>
          {item.completed?.location
            ? LOCATION_LABEL[item.completed.location]
            : '—'}
        </td>
        <td className={css.td}>
          {item.completed?.by ? item.completed.by.name : '—'}
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
                {canStart && (
                  <button
                    className={css.btnStart}
                    onClick={() => {
                      startItem({ orderId, itemId: item._id });
                      setIsDropdownOpen(false);
                    }}
                    disabled={isStatusActionPending}
                    title="Start production"
                  >
                    <Play size={16} strokeWidth={1.5} />
                  </button>
                )}

                {canCompleteOrReject && (
                  <>
                    <button
                      className={css.btnComplete}
                      onClick={() => {
                        completeItem({ orderId, itemId: item._id });
                        setIsDropdownOpen(false);
                      }}
                      disabled={isStatusActionPending}
                      title="Mark as completed"
                    >
                      <Check size={16} strokeWidth={1.5} />
                    </button>
                    <button
                      className={css.btnReject}
                      onClick={() => {
                        setIsRejectConfirmOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      disabled={isStatusActionPending}
                      title="Reject — creates a rework item"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  </>
                )}

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

      {isRejectConfirmOpen && (
        <ModalOverlay onClose={() => setIsRejectConfirmOpen(false)}>
          <ConfirmContainer
            text="Reject this item? A new item will be automatically created for rework."
            onConfirm={() => {
              rejectItem({ orderId, itemId: item._id });
              setIsRejectConfirmOpen(false);
            }}
            onClose={() => setIsRejectConfirmOpen(false)}
          />
        </ModalOverlay>
      )}
    </>
  );
}

export default OrderItemRow;
