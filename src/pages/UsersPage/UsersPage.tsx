import { Plus } from 'lucide-react';
import UsersTable, {
  type UsersSortField,
} from '../../components/UsersTable/UsersTable';
import css from './UsersPage.module.css';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '../../components/Pagination/Pagination';
import UsersRoleFilter from '../../components/UsersRoleFilter/UsersRoleFilter';
import UsersStatusFilter from '../../components/UsersStatusFilter/UsersStatusFilter';
import { getAllUsersApi } from '../../services/usersApi';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import UserForm from '../../components/UserForm/UserForm';
import SearchBox from '../../components/SearchBox/SearchBox';
import { useSearchParams } from 'react-router-dom';
import type { SortOrder } from '../../types/common';

function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const queryParams = {
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 20),
    sortBy: (searchParams.get('sortBy') || 'createdAt') as UsersSortField,
    sortOrder: (searchParams.get('sortOrder') || 'asc') as SortOrder,
    name: searchParams.get('name') || '',
    tel: searchParams.get('tel') || '',
    role: searchParams.get('role') || '',
    isActive: searchParams.get('isActive')
      ? searchParams.get('isActive') === 'true'
      : undefined,
  };

  const { page, perPage, sortBy, sortOrder, name, tel, role, isActive } =
    queryParams;
  const inputValue = name || tel || '';
  const roleValue = role || 'all';

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
        params.delete('tel');
      } else if (/^\d+$/.test(value)) {
        params.set('tel', value);
        params.delete('name');
      } else {
        params.set('name', value);
        params.delete('tel');
      }

      params.set('page', '1');
      return params;
    });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);

    params.delete('name');
    params.delete('tel');
    params.set('page', '1');

    setSearchParams(params);
  };

  const handleRoleChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value === 'all') {
        params.delete('role');
      } else {
        params.set('role', value);
      }
      params.set('page', '1');
      return params;
    });
  };

  const handleStatusChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value === 'all') {
        params.delete('isActive');
      } else {
        params.set('isActive', value === 'active' ? 'true' : 'false');
      }
      params.set('page', '1');
      return params;
    });
  };

  const handleSortChange = (field: UsersSortField) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
      params.set('sortBy', field);
      params.set('sortOrder', newOrder);
      return params;
    });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allUsers', queryParams],
    queryFn: () => getAllUsersApi(queryParams),
    placeholderData: keepPreviousData,
  });

  const allUsers = data?.users ?? [];
  const totalUsers = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalUsers);

  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <div>
          <span className={css.title}>User's List</span>
          <p className={css.subtitle}>{totalUsers} users</p>
        </div>

        <div className={css.topWrapper}>
          <SearchBox
            placeholder="User's name ou telephone..."
            value={inputValue}
            onChange={handleInputChange}
            onClear={handleClearSearch}
          />
          <UsersRoleFilter value={roleValue} onChange={handleRoleChange} />
          <UsersStatusFilter
            value={
              isActive === undefined ? 'all' : isActive ? 'active' : 'inactive'
            }
            onChange={handleStatusChange}
          />
          <button type="button" className={css.btn} onClick={openModal}>
            <Plus />
            <span>Create New User</span>
          </button>
        </div>
      </div>
      <UsersTable
        users={allUsers}
        isLoading={isLoading}
        isError={isError}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        perPage={perPage}
        onSortChange={handleSortChange}
      />

      <div className={css.bottom}>
        {totalUsers > 0 && (
          <span className={css.counter}>
            {from}–{to} of {totalUsers}
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
          <UserForm onClose={closeModal} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default UsersPage;
