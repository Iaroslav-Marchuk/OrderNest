import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './ClientsPage.module.css';
import { getAllClientsApi } from '../../services/clientsApi';
import { useState } from 'react';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import ClientForm from '../../components/ClientForm/ClientForm';
import Pagination from '../../components/Pagination/Pagination';
import { Plus } from 'lucide-react';
import ClientsTable from '../../components/ClientsTable/ClientsTable';
import SearchBox from '../../components/SearchBox/SearchBox';

const MOCK_TOTAL_PAGES = 5;
const MOCK_TOTAL_USERS = 42;
const MOCK_PER_PAGE = 10;

function ClientsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allClients'],
    queryFn: getAllClientsApi,
    placeholderData: keepPreviousData,
  });

  const allClients = data ?? [];
  const totalClients = allClients.length;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [currentPage, setCurrentPage] = useState(1);

  const from = (currentPage - 1) * MOCK_PER_PAGE + 1;
  const to = Math.min(currentPage * MOCK_PER_PAGE, MOCK_TOTAL_USERS);

  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <div>
          <span className={css.title}>Clients's List</span>
          <p className={css.subtitle}>{totalClients} clients</p>
        </div>

        <div className={css.topWrapper}>
          <SearchBox placeholder="Client's name..." />

          <button type="button" className={css.btn} onClick={openModal}>
            <Plus />
            <span>Add New Client</span>
          </button>
        </div>
      </div>
      <ClientsTable
        clients={allClients}
        isLoading={isLoading}
        isError={isError}
      />
      <div className={css.bottom}>
        <span className={css.counter}>
          {from}–{to} of {totalClients}
        </span>
        <Pagination
          totalPages={MOCK_TOTAL_PAGES}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <ModalOverlay
          onClose={closeModal}
          children={<ClientForm onClose={closeModal} />}
        />
      )}
    </div>
  );
}

export default ClientsPage;
