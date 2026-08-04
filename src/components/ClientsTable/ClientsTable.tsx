import type { Client, ClientsSortField } from '../../types/client';
import css from './ClientsTable.module.css';
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import ClientRow from '../ClientRow/ClientRow';
import type { SortOrder } from '../../types/common';
import SkeletonClients from '../SkeletonClients/SkeletonClients';

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  sortBy: ClientsSortField;
  sortOrder: SortOrder;
  onSortChange: (field: ClientsSortField) => void;
}

function ClientsTable({
  clients,
  isLoading,
  isError,
  page,
  perPage,
  sortBy,
  sortOrder,
  onSortChange,
}: ClientsTableProps) {
  const getSortIcon = (field: ClientsSortField) => {
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

  if (!isLoading && clients.length === 0)
    return <p className={css.state}> No clients found!</p>;

  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th className={css.th}>#</th>
          <th className={css.th}>
            <button className={css.thBtn} onClick={() => onSortChange('name')}>
              Client's name {getSortIcon('name')}
            </button>
          </th>

          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => onSortChange('createdAt')}
            >
              Created {getSortIcon('createdAt')}
            </button>
          </th>
          <th className={css.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <SkeletonClients />
        ) : (
          clients.map((client, index) => (
            <ClientRow
              key={client._id}
              client={client}
              index={(page - 1) * perPage + index + 1}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

export default ClientsTable;
