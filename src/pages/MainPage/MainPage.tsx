import Container from '../../components/Container/Container';
import Section from '../../components/Section/Section';
import css from './MainPage.module.css';
import { useState } from 'react';

import { Plus } from 'lucide-react';
import Pagination from '../../components/Pagination/Pagination';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import OrdersTable from '../../components/OrdersTable/OrdersTable';
import OrderForm from '../../components/OrderForm/OrderForm';

import { useOrders } from '../../hooks/useOrders';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useOrderQueryParams } from '../../hooks/useOrderQueryParams';
import OrderFilters from '../../components/OrderFilters/OrderFilters';

function MainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { currentUser } = useCurrentUser();
  const PRODUCTION_ROLES = ['hardening', 'quality', 'logistics'];

  const defaultLocation =
    currentUser?.role === 'assembly'
      ? (currentUser.location ?? '')
      : currentUser?.role && PRODUCTION_ROLES.includes(currentUser.role)
        ? currentUser.role
        : '';

  const { queryParams, handleSetPage, handleSortChange } = useOrderQueryParams({
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'asc',
    defaultLocation,
  });

  const { page, perPage, sortBy, sortOrder } = queryParams;

  const { orders, totalItems, totalPages, isOrdersLoading, isOrdersError } =
    useOrders(queryParams);

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  const canManageOrders = [
    'hardening',
    'assembly',
    'quality',
    'logistics',
  ].includes(currentUser?.role ?? '');

  return (
    <Section>
      <Container className={css.container}>
        <div className={css.top}>
          <div>
            <span className={css.title}>Order's List</span>
            <p className={css.subtitle}>{totalItems} active orders</p>
          </div>

          <div className={css.topWrapper}>
            <OrderFilters
              defaultRangeDays={7}
              defaultLocation={defaultLocation}
            />
            <button
              type="button"
              className={css.btn}
              onClick={openModal}
              disabled={!canManageOrders}
            >
              <Plus />
              <span>Create New Order</span>
            </button>
          </div>
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
          canManageOrders={canManageOrders}
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

        {isModalOpen && (
          <ModalOverlay onClose={closeModal}>
            <OrderForm onClose={closeModal} />
          </ModalOverlay>
        )}
      </Container>
    </Section>
  );
}

export default MainPage;
