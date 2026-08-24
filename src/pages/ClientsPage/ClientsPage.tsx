import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import type { SortOrder } from '../../types/common';
import type { ClientsSortField } from '../../types/client';

import { useClients } from '../../hooks/useClients';

import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import ClientForm from '../../components/ClientForm/ClientForm';
import Pagination from '../../components/Pagination/Pagination';
import ClientsTable from '../../components/ClientsTable/ClientsTable';
import SearchBox from '../../components/SearchBox/SearchBox';

import css from './ClientsPage.module.css';

function ClientsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const queryParams = {
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 20),
    sortBy: (searchParams.get('sortBy') || 'createdAt') as ClientsSortField,
    sortOrder: (searchParams.get('sortOrder') || 'asc') as SortOrder,
    name: searchParams.get('name') || '',
  };

  const { page, perPage, sortBy, sortOrder, name } = queryParams;

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
        params.delete('name');
      } else {
        params.set('name', value);
      }

      params.set('page', '1');
      return params;
    });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);

    params.delete('name');
    params.set('page', '1');

    setSearchParams(params);
  };

  const handleSortChange = (field: ClientsSortField) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
      params.set('sortBy', field);
      params.set('sortOrder', newOrder);
      return params;
    });
  };

  const { clients, totalItems, totalPages, isClientsLoading, isClientsError } =
    useClients(queryParams);

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <div>
          <span className={css.title}>Client's List</span>
          <p className={css.subtitle}>{totalItems} clients</p>
        </div>

        <div className={css.topWrapper}>
          <SearchBox
            placeholder="Client's name..."
            value={name}
            onChange={handleInputChange}
            onClear={handleClearSearch}
          />

          <button type="button" className={css.btn} onClick={openModal}>
            <Plus />
            <span>Add New Client</span>
          </button>
        </div>
      </div>
      <ClientsTable
        clients={clients}
        isLoading={isClientsLoading}
        isError={isClientsError}
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
          <ClientForm onClose={closeModal} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default ClientsPage;
