import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import type { User } from '../../types/user';
import UserRow from '../UserRow/UserRow';
import css from './UsersTable.module.css';
import { useState } from 'react';

type SortField = 'name' | 'role' | 'status' | 'updatedAt';
type SortOrder = 'asc' | 'desc';

// interface UsersTableProps {
//   sortBy: SortField | null;
//   sortOrder: SortOrder;
//   onSortChange: (field: SortField, order: SortOrder) => void;
// }

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
}

function UsersTable({ users, isLoading, isError }: UsersTableProps) {
  const [sortBy, setSortBy] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSortClick = (field: SortField) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    // TODO: підключити реальне сортування
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? (
        <ArrowUpNarrowWide size={14} strokeWidth={1.5} />
      ) : (
        <ArrowDownWideNarrow size={14} strokeWidth={1.5} />
      );
    }
    return <ArrowDownUp size={14} strokeWidth={1.5} />;
  };

  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th className={css.th}>#</th>
          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => handleSortClick('name')}
            >
              User's name {getSortIcon('name')}
            </button>
          </th>
          <th className={css.th}>Telephone Number</th>
          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => handleSortClick('role')}
            >
              Role {getSortIcon('role')}
            </button>
          </th>
          <th className={css.th}>Status</th>
          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => handleSortClick('updatedAt')}
            >
              Last Activity {getSortIcon('updatedAt')}
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

          {isError && (
            <tr>
              <td colSpan={7} className={css.state}>
                Something went wrong
              </td>
            </tr>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <tr>
              <td colSpan={7} className={css.state}>
                No users found
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            users.map((user, index) => (
              <UserRow key={user._id} user={user} index={index + 1} />
            ))}
        </>
      </tbody>
    </table>
  );
}

export default UsersTable;
