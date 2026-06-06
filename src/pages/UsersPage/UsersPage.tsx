import { Plus } from 'lucide-react';
import UsersSearchBox from '../../components/UsersSearchBox/UsersSearchBox';
import UsersTable from '../../components/UsersTable/UsersTable';
import css from './UsersPage.module.css';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '../../components/Pagination/Pagination';
import UsersRoleFilter from '../../components/UsersRoleFilter/UsersRoleFilter';
import UsersStatusFilter from '../../components/UsersStatusFilter/UsersStatusFilter';
import { getAllUsersApi } from '../../services/usersApi';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import UserForm from '../../components/UserForm/UserForm';

const MOCK_TOTAL_PAGES = 5;
const MOCK_TOTAL_USERS = 42;
const MOCK_PER_PAGE = 10;

function UsersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allUsers'],
    queryFn: getAllUsersApi,
    placeholderData: keepPreviousData,
  });

  const allUsers = data ?? [];
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.isActive).length;

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
          <span className={css.title}>User's List</span>
          <p className={css.subtitle}>
            {totalUsers} users · {activeUsers} active
          </p>
        </div>

        <div className={css.topWrapper}>
          <UsersSearchBox />
          <UsersRoleFilter />
          <UsersStatusFilter />
          <button type="button" className={css.btn} onClick={openModal}>
            <Plus />
            <span>Create New User</span>
          </button>
        </div>
      </div>
      <UsersTable users={allUsers} isLoading={isLoading} isError={isError} />
      <div className={css.bottom}>
        <span className={css.counter}>
          {from}–{to} of {totalUsers}
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
          children={<UserForm onClose={closeModal} />}
        />
      )}
    </div>
  );
}

export default UsersPage;
