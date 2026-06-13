import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import type { User } from '../../types/user';
import UserRow from '../UserRow/UserRow';
import css from './UsersTable.module.css';
import type { SortOrder } from '../../types/common';

export type UsersSortField = 'name' | 'role' | 'createdAt';

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
        <>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className={css.skeletonRow}>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '20px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '140px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '120px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '80px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '60px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '100px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '60px' }} />
                </td>
              </tr>
            ))}

          {!isLoading &&
            !isError &&
            users.map((user, index) => (
              <UserRow
                key={user._id}
                user={user}
                index={(page - 1) * perPage + index + 1}
              />
            ))}
        </>
      </tbody>
    </table>
  );
}

export default UsersTable;
