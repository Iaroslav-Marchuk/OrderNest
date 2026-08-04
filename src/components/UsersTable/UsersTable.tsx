import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';

import UserRow from '../UserRow/UserRow';
import SkeletonUsers from '../SkeletonUsers/SkeletonUsers';

import type { SortOrder } from '../../types/common';
import type { User, UsersSortField } from '../../types/user';

import css from './UsersTable.module.css';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  sortBy: UsersSortField;
  sortOrder: SortOrder;
  onSortChange: (field: UsersSortField) => void;
}

function UsersTable({
  users,
  isLoading,
  isError,
  page,
  perPage,
  sortBy,
  sortOrder,
  onSortChange,
}: UsersTableProps) {
  const getSortIcon = (field: UsersSortField) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? (
        <ArrowUpNarrowWide size={14} strokeWidth={1.5} />
      ) : (
        <ArrowDownWideNarrow size={14} strokeWidth={1.5} />
      );
    }
    return <ArrowDownUp size={14} strokeWidth={1.5} />;
  };

  if (isError) return <p className={css.state}> Something went wrong!</p>;

  if (!isLoading && users.length === 0)
    return <p className={css.state}> No users found!</p>;

  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th className={css.th}>#</th>
          <th className={css.th}>
            <button className={css.thBtn} onClick={() => onSortChange('name')}>
              User's name {getSortIcon('name')}
            </button>
          </th>
          <th className={css.th}>Telephone Number</th>
          <th className={css.th}>
            <button className={css.thBtn} onClick={() => onSortChange('role')}>
              Role {getSortIcon('role')}
            </button>
          </th>
          <th className={css.th}>Status</th>
          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => onSortChange('createdAt')}
            >
              Created At {getSortIcon('createdAt')}
            </button>
          </th>
          <th className={css.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <SkeletonUsers />
        ) : (
          users.map((user, index) => (
            <UserRow
              key={user._id}
              user={user}
              index={(page - 1) * perPage + index + 1}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

export default UsersTable;
