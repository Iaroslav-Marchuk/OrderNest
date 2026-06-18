import { useSearchParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import SearchBox from '../../components/SearchBox/SearchBox';
import Section from '../../components/Section/Section';
import css from './MainPage.module.css';
import { useState } from 'react';
import type { SortOrder } from '../../types/common';
// import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Pagination from '../../components/Pagination/Pagination';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import OrdersTable from '../../components/OrdersTable/OrdersTable';

const MOCK = {
  totalOrders: 72,
};

const allOrders = [
  {
    id: '1',
    ep: 'EP-0041',
    client: 'Vidraceiros Tejo',
    createdAt: '2025-06-12',
    location: 'Cutting',
    responsible: 'Ana Costa',
    status: 'cutting',
    items: [
      {
        id: '1-1',
        glassType: 'Temperado',
        thickness: 10,
        size: { width: 1200, height: 800 },
        quantity: 4,
      },
      {
        id: '1-2',
        glassType: 'Laminado',
        thickness: 8,
        size: { width: 900, height: 600 },
        quantity: 2,
      },
    ],
  },
  {
    id: '2',
    ep: 'EP-0042',
    client: 'Janelas Lisboa',
    createdAt: '2025-06-13',
    location: 'Assembly',
    responsible: 'Carlos Melo',
    status: 'assembly',
    items: [
      {
        id: '2-1',
        glassType: 'Simples',
        thickness: 6,
        size: { width: 600, height: 400 },
        quantity: 8,
      },
    ],
  },
];

type OrdersSortField = 'createdAt' | 'ep' | 'cliente';

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
    ep: searchParams.get('ep') || '',
    cliente: searchParams.get('cliente') || '',
  };

  const { page, perPage, sortBy, sortOrder, ep, cliente } = queryParams;
  const inputValue = ep || cliente || '';

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
        params.delete('cliente');
      } else if (/^\d+$/.test(value)) {
        params.set('ep', value);
        params.delete('cliente');
      } else {
        params.set('cliente', value);
        params.delete('ep');
      }

      params.set('page', '1');
      return params;
    });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);

    params.delete('ep');
    params.delete('cliente');
    params.set('page', '1');

    setSearchParams(params);
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

  //  const { data, isLoading, isError } = useQuery({
  //    queryKey: ['allUsers', queryParams],
  //    queryFn: () => getAllUsersApi(queryParams),
  //    placeholderData: keepPreviousData,
  //  });

  const isLoading = false;
  const isError = false;
  const totalOrders = MOCK.totalOrders; // вже є — 72
  const totalPages = Math.ceil(totalOrders / perPage);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalOrders);

  return (
    <Section>
      <Container className={css.container}>
        <div className={css.top}>
          <div>
            <span className={css.title}>Order's List</span>
            <p className={css.subtitle}>{MOCK.totalOrders} active orders</p>
          </div>

          <div className={css.topWrapper}>
            <SearchBox
              placeholder="User's name ou telephone..."
              value={inputValue}
              onChange={handleInputChange}
              onClear={handleClearSearch}
            />

            <button type="button" className={css.btn} onClick={openModal}>
              <Plus />
              <span>Create New Order</span>
            </button>
          </div>
        </div>

        <OrdersTable
          orders={allOrders}
          isLoading={isLoading}
          isError={isError}
          sortBy={sortBy}
          sortOrder={sortOrder}
          page={page}
          perPage={perPage}
          onSortChange={handleSortChange}
        />

        <div className={css.bottom}>
          {totalOrders > 0 && (
            <span className={css.counter}>
              {from}–{to} of {totalOrders}
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
            {/* <OrderForm onClose={closeModal} /> */}ORDER FORM
          </ModalOverlay>
        )}
      </Container>
    </Section>
  );
}

export default MainPage;
