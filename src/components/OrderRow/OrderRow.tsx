import { Fragment, useEffect, useRef, useState } from 'react';
import type { Order } from '../../types/order';
import css from './OrderRow.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrderApi } from '../../services/ordersApi';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { ChevronDown, Ellipsis, Pencil, Trash2 } from 'lucide-react';
import OrderItemsTable from '../OrderItemsTable/OrderItemsTable';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import EditOrderForm from '../EditOrderForm/EditOrderForm';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import { useCurrentUser } from '../../hooks/useCurrentUser';

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

const LOCATION_LABEL: Record<Order['location'], string> = {
  line_1: 'Line 1',
  line_2: 'Line 2',
  line_3: 'Line 3',
};

function OrderRow({ order, index }: OrderRowProps) {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isStarted = order.status !== 'created';
  const isOwner = currentUser?._id === order.owner?._id;
  const isLocked = isStarted || !isOwner;

  const getLockReason = () => {
    if (isStarted) return 'Order already started production';
    if (!isOwner) return 'You can only manage your own orders';
    return undefined;
  };

  const { mutate: deleteOrder } = useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order deleted successfully!');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

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
          {new Date(order.createdAt).toLocaleDateString('pt-PT')}
        </td>
        <td className={css.td}>{LOCATION_LABEL[order.location]}</td>
        <td className={css.td}>
          <span className={css.responsible}>{order.owner?.name ?? '—'}</span>
        </td>
        <td className={css.td}>
          <span className={`${css.status} ${STATUS_CLASS[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
        </td>
        <td className={css.td}>{order.itemsCount}</td>
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
                  disabled={isLocked}
                  title={getLockReason() ?? 'Edit'}
                >
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button
                  className={css.btnDelete}
                  onClick={() => {
                    setIsConfirmOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  disabled={isLocked}
                  title={getLockReason() ?? 'Delete'}
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={9} className={css.expandCell}>
            <OrderItemsTable
              orderId={order._id}
              ownerId={order.owner?._id ?? ''}
              orderStatus={order.status}
            />
          </td>
        </tr>
      )}

      {isEditOpen && (
        <ModalOverlay onClose={() => setIsEditOpen(false)}>
          <EditOrderForm order={order} onClose={() => setIsEditOpen(false)} />
        </ModalOverlay>
      )}

      {isConfirmOpen && (
        <ModalOverlay onClose={() => setIsConfirmOpen(false)}>
          <ConfirmContainer
            text={`Do you really want to delete order EP-${order.ep}?`}
            onConfirm={() => {
              deleteOrder(order._id);
              setIsConfirmOpen(false);
            }}
            onClose={() => setIsConfirmOpen(false)}
          />
        </ModalOverlay>
      )}
    </Fragment>
  );
}

export default OrderRow;
