import { useSearchParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import SearchBox from '../../components/SearchBox/SearchBox';
import Section from '../../components/Section/Section';
import css from './MainPage.module.css';
import { useState } from 'react';
import type { SortOrder } from '../../types/common';
import { Plus } from 'lucide-react';
import Pagination from '../../components/Pagination/Pagination';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import OrdersTable, {
  type OrdersSortField,
} from '../../components/OrdersTable/OrdersTable';
import OrderForm from '../../components/OrderForm/OrderForm';

import { useOrders } from '../../hooks/useOrders';

import OrderDateFilter from '../../components/OrderDateFilter/OrderDateFilter';
import OrderLocationFilter from '../../components/OrderLocationFilter/OrderLocationFilter';
import { useCurrentUser } from '../../hooks/useCurrentUser';

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const queryParams = {
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 20),
    sortBy: (searchParams.get('sortBy') || 'createdAt') as OrdersSortField,
    sortOrder: (searchParams.get('sortOrder') || 'asc') as SortOrder,
    ep: Number(searchParams.get('ep')) || '',
    client: searchParams.get('client') || '',
    date: searchParams.get('date') || '',
    location: searchParams.get('location') || '',
  };

  const { page, perPage, sortBy, sortOrder, ep, client, date, location } =
    queryParams;
  const inputValue = String(ep || client || '');
  const locationValue = location || 'all';
  const dateValue = date ? new Date(date) : null;

  const handleSetPage = (page: number) => {
    const params = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...params,
      page: String(page),
    });
  };

  const handleInputChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);

      if (!value) {
        params.delete('ep');
        params.delete('client');
      } else if (/^\d+$/.test(value)) {
        params.set('ep', value);
        params.delete('client');
      } else {
        params.set('client', value);
        params.delete('ep');
      }

      params.set('page', '1');
      return params;
    });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);

    params.delete('ep');
    params.delete('client');
    params.set('page', '1');

    setSearchParams(params);
  };

  const handleLocationChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value === 'all') {
        params.delete('location');
      } else {
        params.set('location', value);
      }
      params.set('page', '1');
      return params;
    });
  };

  const handleDateChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value === '') {
        params.delete('date');
      } else {
        params.set('date', value);
      }
      params.set('page', '1');
      return params;
    });
  };

  const handleSortChange = (field: OrdersSortField) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
      params.set('sortBy', field);
      params.set('sortOrder', newOrder);
      return params;
    });
  };

  const { orders, totalItems, totalPages, isOrdersLoading, isOrdersError } =
    useOrders(queryParams);

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  const { currentUser } = useCurrentUser();
  const canCreateOrder = [
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
            <SearchBox
              placeholder="EP or client's name..."
              value={inputValue}
              onChange={handleInputChange}
              onClear={handleClearSearch}
            />

            <OrderDateFilter
              dateValue={dateValue}
              onChange={handleDateChange}
            />
            <OrderLocationFilter
              value={locationValue}
              onChange={handleLocationChange}
            />

            <button
              type="button"
              className={css.btn}
              onClick={openModal}
              disabled={!canCreateOrder}
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
