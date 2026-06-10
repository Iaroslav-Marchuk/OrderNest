import { useState } from 'react';
import type { Client } from '../../types/client';
import css from './ClientsTable.module.css';
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import ClientRow from '../ClientRow/ClientRow';

type SortOrder = 'asc' | 'desc';
type SortField = 'name' | 'createdAt';

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  isError: boolean;
}

function ClientsTable({ clients, isLoading, isError }: ClientsTableProps) {
  const [sortBy, setSortBy] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSortClick = (field: SortField) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
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
              Clients's name {getSortIcon('name')}
            </button>
          </th>

          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => handleSortClick('createdAt')}
            >
              Created {getSortIcon('createdAt')}
            </button>
          </th>
          <th className={css.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        <>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`}>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '20px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '200px' }} />
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
              <td colSpan={4} className={css.state}>
                Something went wrong
              </td>
            </tr>
          )}

          {!isLoading && !isError && clients.length === 0 && (
            <tr>
              <td colSpan={7} className={css.state}>
                No clients found
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            clients.map((client, index) => (
              <ClientRow key={client._id} client={client} index={index + 1} />
            ))}
        </>
      </tbody>
    </table>
  );
}

export default ClientsTable;
