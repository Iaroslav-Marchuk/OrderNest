import { useState } from 'react';
import Container from '../../components/Container/Container';
import OrderFilters from '../../components/OrderFilters/OrderFilters';
import OrdersTable from '../../components/OrdersTable/OrdersTable';
import Pagination from '../../components/Pagination/Pagination';
import Section from '../../components/Section/Section';
import { useArchivedOrders } from '../../hooks/useArchivedOrders';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useOrderQueryParams } from '../../hooks/useOrderQueryParams';
import css from './ArchivePage.module.css';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import ConfirmContainer from '../../components/ConfirmContainer/ConfirmContainer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearArchiveApi } from '../../services/ordersApi';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

function ArchivePage() {
  const queryClient = useQueryClient();
  const { queryParams, handleSetPage, handleSortChange } = useOrderQueryParams({
    defaultSortBy: 'updatedAt',
    defaultSortOrder: 'desc',
  });

  const { isAdmin } = useCurrentUser();

  const { mutate: clearArchive, isPending } = useMutation({
    mutationFn: clearArchiveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivedOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orderItems'] });
      toast.success('Archive cleared successfully!');
      closeConfirm();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  const { page, perPage, sortBy, sortOrder } = queryParams;

  const { orders, totalItems, totalPages, isOrdersLoading, isOrdersError } =
    useArchivedOrders(queryParams);

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <Section>
      <Container className={css.container}>
        <div className={css.top}>
          <div>
            <span className={css.title}>Archive</span>
            <p className={css.subtitle}>{totalItems} completed orders</p>
          </div>

          <div className={css.topWrapper}>
            <OrderFilters defaultRangeDays={7} />
          </div>

          {isAdmin ? (
            <button
              className={css.btnClear}
              onClick={openConfirm}
              title="Clear Archive"
              disabled={isPending}
            >
              {isPending ? 'Clearing...' : 'Clear Archive'}
            </button>
          ) : undefined}
        </div>

        <OrdersTable
          orders={orders}
          isLoading={isOrdersLoading}
          isError={isOrdersError}
          sortBy={sortBy}
          sortOrder={sortOrder}
          page={page}
          perPage={perPage}
          onSortChange={handleSortChange}
        />

        <div className={css.bottom}>
          {totalItems > 0 && (
            <span className={css.counter}>
              {from}–{to} of {totalItems}
            </span>
          )}

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handleSetPage}
            />
          )}
        </div>
      </Container>

      {isConfirmOpen && (
        <ModalOverlay onClose={closeConfirm}>
          <ConfirmContainer
            text={'Are you sure you want to clear all archived orders?'}
            onConfirm={clearArchive}
            onClose={closeConfirm}
          />
        </ModalOverlay>
      )}
    </Section>
  );
}

export default ArchivePage;
